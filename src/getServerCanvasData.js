

/**
 * return a promise that resolves to a blob and timestamp, or resolves to null if the fetch request is aborted
 * @param {{
 *      query?:{width?:number, height?:number},
 *      signal?:AbortSignal
 *      updateStatus?:function
 * }} options 
 * 
 * @returns {Promise<{blob:Blob,blobTimestamp:string}|null>}
 */

//refactor : callback arg -> return promise
export async function getServerCanvasData(options){

    const {
        query = {},      //GET query params (optional)
        signal,   
        updateStatus     
    } = options

    console.log('fetching canvas data from server...')

    try{        
        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        const queryParams = new URLSearchParams(query)

        url.search = queryParams

        console.log(`fetch GET ${url.toString()}`)        


        let res;

        //backend hosted on a free heroku dyno, so it might need a few seconds to wake up & ready the canvas
        //repeat the request after a few seconds if server sends 503
        for(let tries = 6; tries > 0; tries --){
            updateStatus?.('fetching canvas data...')
            res = await fetch(url, {signal})

            //retry message from server
            if(res.status === 503){
                const seconds = Number(res.headers.get('retry-after') ?? 10);
                updateStatus?.(`server waking up...`)
                await new Promise(resolve => setTimeout(resolve, seconds))
                
            }else{

                //some other error
                if(!res.ok){
                    console.log(`fetch error status: ${res.status}: ${res.statusText}`)
                    throw new Error('error response while fetching canvas')
                }

                //successful
                break;                
            }
        }
        

        console.log(`getServerCanvasData.js: received response with status ${res.status}: ${res.statusText}`)

        updateStatus?.('reading image stream...')

        //response headers
        const timestamp = (res.headers.get('x-timestamp'))
        // const contentLength = Number(res.headers.get('content-length'));
        const maxLength = Number(res.headers.get('x-uncompressed-length'));

        console.log(`source length pre-compression: ${maxLength} bytes`)

        let buffer = new Uint8Array(maxLength),
        // let buffer = new Uint8Array(contentLength),
            bytesRead = 0,
            chunks = 0;

        const reader = res.body.getReader()

        return new Promise((resolve, reject) => {


            console.log('processing stream...')
            const processStream = () => {
                
                return reader.read().then(({done, value}) => {                                        
                    if(done){
                        console.log(`done writing ${chunks} chunks to buffer`)
                        resolve(buffer);
                    }
                                   
                    
                    buffer.set(value, bytesRead);
                    bytesRead += (value?.length ?? 0);
                    chunks++;

                    return processStream();
                }).catch(e => {
                    reject(e);
                })
            }

            processStream();
        })
        
        .then(buffer =>  {
            console.log(`read ${bytesRead} bytes`)
            return buffer.slice(0,bytesRead)
        })


        .then(buffer => {
            console.log('finished reading from stream')
            return {
                blob: new Blob([buffer], {type: res.headers.get('content-type')}),
                blobTimestamp: timestamp
            }
                        
        })
        

    }catch(e){

        
        const errorHandler = {
            'AbortError': () => console.log(`getServerCanvasData: fetch request aborted; reason: ${signal?.reason}`),
        }

        console.log('\ne.name')
        console.log(e.name)
        if(errorHandler[e.name]){
            
            errorHandler[e.name](e);

            return null;
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
            return null;
        }else throw e;
    }
}