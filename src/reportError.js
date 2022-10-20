export async function reportError(err){

    const own = Object.getOwnPropertyNames(err);
    const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(err));

    const props = [...own, ...proto].reduce((p, n) => {
        return p.includes(n) ?
            p :
            [...p, n]
    },[])

    const json = JSON.stringify(err, props);

    console.log(json)

    const url = new URL(process.env.REACT_APP_SERVER_URL + 'error');

    try{
        const res = await fetch(url, {
            method: 'post',
            body:json,
            headers: {
                'content-type': 'application/json'
            }
        })

        console.log(`server responded with status ${res.status} (${res.statusText})`)
    }catch(e){
        console.log('something went wrong while reporting the error')
        console.log(e)
    }
    
}