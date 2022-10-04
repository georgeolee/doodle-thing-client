
/**
 * 
 * @param {{
 *      onSuccess: function,
 *      onError?: function,
 *      query?:{width?:number, height?:number}
 * }} options 
 */
export async function getServerCanvasData(options){

    const {
        onSuccess,  //callback to handle server response
        onError = err => console.log('getServerCanvasData: error fetching canvas data', err),    //error handler
        query = {},      //GET query params (optional)
        signal,
    } = options

    console.log('fetching canvas data from server...')

    try{
        // const res = await fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE)

        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        const queryParams = new URLSearchParams(query)

        url.search = queryParams

        console.log(`fetch GET ${url.toString()}`)

        const res = await fetch(url, {signal})

        console.log(`getServerCanvasData.js: received response with status ${res.status}: ${res.statusText}`)

        const timestamp = (res.headers.get('x-timestamp'))

        const blob = await res.blob()

        onSuccess(blob, timestamp)

    }catch(e){
        if(e.name === 'AbortError'){
            console.log(`getServerCanvasData: fetch request aborted; reason: ${signal?.reason}`)
        }else onError(e)
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