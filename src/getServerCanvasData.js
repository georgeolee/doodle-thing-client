
/**
 * 
 * @param {function(canvasData)} successHandler 
 * @param {function(Error)} errorHandler 
 */
export async function getServerCanvasData(successHandler, errorHandler=null){
    console.log('fetching canvas data from server...')

    try{
        const res = await fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE)
        const cdata = await res.json()
        successHandler(cdata)
    }catch(e){
        // console.log(e)
        errorHandler?.(e)
    }
}