
/**
 * 
 * @param {function(canvasData)} successHandler 
 * @param {function(Error)} errorHandler 
 */
export async function getServerCanvasData(options){

    const {
        onSuccess,  //callback to handle server response
        onError = null,    //error handler (optional)
        query = {},      //key/value query params (optional)
    } = options

    console.log('fetching canvas data from server...')

    try{
        // const res = await fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE)

        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        const queryParams = new URLSearchParams(query)

        url.search = queryParams

        // const res = await fetch(process.env.REACT_APP_SERVER_URL + 'canvas')
        console.log(`GET ${url.toString()}`)
        const res = await fetch(url.toString())
        const cdata = await res.json()
        onSuccess(cdata)
    }catch(e){
        // console.log(e)
        onError?.(e)
    }
}