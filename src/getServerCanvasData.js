
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
        onError = err => console.log(err),    //error handler
        query = {},      //GET query params (optional)
    } = options

    console.log('fetching canvas data from server...')

    try{
        // const res = await fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE)

        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        const queryParams = new URLSearchParams(query)

        url.search = queryParams

        console.log(`fetch GET ${url.toString()}`)

        const res = await fetch(url)

        console.log(`getServerCanvasData.js: received response with status ${res.status}: ${res.statusText}`)

        const timestamp = (res.headers.get('x-timestamp'))

        const blob = await res.blob()

        onSuccess(blob, timestamp)

    }catch(e){
        onError(e)
    }
}

export async function getServerCanvasTimestamp(){
    try{
        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas/timestamp')
        const res = await fetch(url)
        return res.text()
    }catch(e){
        console.log(e)
    }
}