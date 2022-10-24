export function getHexColorValue(hexColor){

    //hex string
    let str = hexColor.match(/^#?((?:[a-f0-9]{3}){1,2}|(?:[a-f0-9]{4}){1,2})$/i)?.[1]
    
    if(!str) throw new Error('getHexColorValue(): invalid string argument')

    //double up if single char per channel
    if(str.length < 6){
        str = str.split('').reduce((p, n) => p + n + n,'')
    }
    
    //split by channel
    str = str.split('').reduce((p,n,i) =>{
        if(i%2 === 0){
            p.push(n)
        }else{
            p[p.length-1] += n
        }
        return p
    }, [])
    
    //average r/g/b channel value
    return str.reduce((p,n,i) => {  
        return (i > 2 ? //skip alpha
            p :
            p + parseInt(n, 16)
        )            
    },0) / 3;                
}