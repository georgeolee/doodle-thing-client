
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
        onError = null,    //error handler (optional)
        query = {},      //GET query params (optional)
        log,
    } = options

    console.log('fetching canvas data from server...')

    try{
        // const res = await fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE)

        const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        // const url = new URL(process.env.REACT_APP_SERVER_URL + 'canvas')
        const queryParams = new URLSearchParams(query)

        url.search = queryParams

        console.log(`GET ${url.toString()}`)
        const res = await fetch(url)
        // const cdata = await res.json()

        //begin testing

        if(log){
            log(`response status: ${res.status}`)
        }

        const h = res.headers.entries()

        const timestamp = (res.headers.get('x-timestamp'))

        for(const e of h){
            console.log(e)
            console.log('jhbjkbhji;b')
        }

        // console.log(await getServerCanvasTimestamp())
        // console.log(res.headers.get('etag'))

        const blob = await res.blob()

        // const blobURL = URL.createObjectURL(blob)
        // console.log(blobURL)

                
        //end testing

        // const a = document.createElement('a')
        // a.href = URL.createObjectURL(blob)
        // a.download = 'blobtest'
        // a.click()

        onSuccess(blob, timestamp)
        // onSuccess(blobURL, timestamp)
        // onSuccess(cdata)
    }catch(e){
        // console.log(e)        
        if(log){
            log(e)
        }
        onError?.(e)
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