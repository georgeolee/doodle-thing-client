import { isRejected } from "@reduxjs/toolkit"

/**
 * 
 * @param {{
 *      onSuccess: function,
 *      onError?: function,
 *      query?:{width?:number, height?:number}
 * }} options 
 */
export async function getServerCanvasData(options, retryCount = 2){

    const {
        onSuccess,  //callback to handle server response
        onError = err => console.log('getServerCanvasData: error fetching canvas data', err),    //error handler
        query = {},      //GET query params (optional)
        signal,
    } = options

    console.log('fetching canvas data from server...')

    try{        
        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        const queryParams = new URLSearchParams(query)

        url.search = queryParams

        console.log(`fetch GET ${url.toString()}`)

        const res = await fetch(url, {signal})


        if(res.status === 503){

            const error = new Error('got 503; ');

            
            if(retryCount > 0){
                const seconds = Number(res.headers.get('retry-after'));
                setTimeout(() => getServerCanvasData(options, retryCount - 1), seconds*1000);
            
                error.name = 'ServerUnavailableError';
                error.message += `retrying in ${seconds} seconds...`;
                error.willRetry = true;
                                
            }else{
                error.name = 'RetriesExceededError';
                error.message += `retry count exceeded; continuing with local canvas only`;                
            }

            throw error;
            
        }

        console.log(`getServerCanvasData.js: received response with status ${res.status}: ${res.statusText}`)

        const timestamp = (res.headers.get('x-timestamp'))



        ///////////////TEST START


        const contentLength = Number(res.headers.get('content-length'));
        
        let bytesRead = 0, chunks = 0;

        const buffer = new Uint8Array(contentLength)

        const reader = res.body.getReader()

        new Promise((resolve, reject) => {


            console.log('processing stream...')
            const processStream = () => {
                
                return reader.read().then(({done, value}) => {                                        
                    if(done){
                        console.log(`done writing ${chunks} chunks to buffer`)
                        resolve(buffer);
                    }
                                        
                    buffer.set(value, bytesRead);
                    bytesRead += value.length;
                    chunks++;

                    return processStream();
                }).catch(e => {
                    reject(e);
                })
            }

            processStream();
        })
        .then(result => {
            // console.log(result)
            return new Blob([result], {type:'image/png'})
        })
        .then(blob => {
            onSuccess(blob, timestamp)
            // console.log(blob)
        })
        .catch(e => console.log(e))
        .finally(() => {
            console.log('finished reading from stream')
            buffer = null;
        })
        
        



        // let data = null;
        // let reachedEnd = false;

        // function readNextChunk(){
        //     try{
        //         return reader.read()
        //     }catch(e){
        //         console.log(e)                
        //     }
        // }


        // while(!reachedEnd){ BADBADBAD

        //     try{
        //         const result = await readNextChunk();
        //         console.log(result)
        //         const {value, done} = result
        //         console.log('read chunk')

        //         if(done){
        //             reachedEnd = true
        //             console.log('done')
        //         }else{
        //             if(!data){
        //                 data = value;
        //             }else{
        //                 let merged = new Uint8Array(data.length + value.length)
        //                 merged.set(data)
        //                 merged.set(value, data.length);
        //                 data = null;
        //                 data = merged;
                        
        //                 console.log(data);
        //             }
        //         }

        //     }catch(e){
        //         console.log(e)
        //         throw e;
        //     }            
        // }

        ////////////////////////TEST END

        // const blob = await res.blob()

        // console.log(blob)

        // onSuccess(blob, timestamp)

    }catch(e){

        
        const errorHandler = {
            'AbortError': () => console.log(`getServerCanvasData: fetch request aborted; reason: ${signal?.reason}`),
        }

        if(e.name in errorHandler){
            
            errorHandler[e.name](e);
        }

        else throw(e)

    }
}

export async function getServerCanvasTimestamp({signal}){
    try{
        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas/timestamp')
        const res = await fetch(url, {signal})
        return res.text()
    }catch(e){
        if(e.name === 'AbortError'){
            console.log(`getServerCanvasTimestamp: fetch request aborted; reason: ${signal?.reason}`)
        }else console.log(e)
    }
}