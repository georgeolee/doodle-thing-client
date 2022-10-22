export async function loadGoogleFont(url){

    console.log(`loading google font from ${url}...`)
    //single escape in regex literal
    //double escape in regexp constructor


    // google font defs look like this:
    //  /* (character set) */
    //  @font-face {
    //  ...
    //  }
    // match a specific character set
    const matchCharSet = (charSet) => new RegExp(`/\\*[^a-z]*?(${charSet})[^a-z]*?\\*/.*?(@font-face.*?{.*?})`, 'isg')
    

    //search pattern w/ 1 capture group and flatten result array (if found) to string
    const extractMatch = (source, capturePattern) => {
        return source.match(capturePattern)?.slice(-1)[0]
    }
    
    const pattern = {
        charSet: str => matchCharSet(str),
        fontFamily: /font-family:.*?[\'\"](.+?)[\'\"];/is,
        
        unicodeRange: /unicode-range:.*?(U.*?);/is,

        fontWeight: /font-weight:.*?(\d+)/is,
        fontStyle: /font-style:[^a-z]*(.*?);/is,

        src: /src:.*?(url\(.*?\))/is,

        //etc
    }
    
    
    
    //fetch the stylesheet
    
    
    try{
        const res = await fetch(url)
        
        if(!res.ok) throw new Error(`error fetching url ${url} - ${res.status}: ${res.statusText}`)
        
        const text = await res.text()

        if(!text) throw new Error('failed to parse body text')

        //get the latin character set
        const charPattern = pattern.charSet('latin');

        //get all character sets
        // const charPattern = pattern.charSet('[a-z-]+');


        

        const matches = 
            [...text.matchAll(charPattern)]
            .map(arr => {
                const def = arr[2]
                return {
                    charSet: arr[1],
                    src: extractMatch(def, pattern.src),
                    family: extractMatch(def, pattern.fontFamily),
                    weight: extractMatch(def, pattern.fontWeight),
                    style: extractMatch(def, pattern.fontStyle),
                    unicodeRange: extractMatch(def, pattern.unicodeRange),
                    def,
                }
            })

        if(!matches || !matches.length){
            throw new Error('failed to match any @font-face declarations in body text')
        }

        const p = []

        matches.forEach(({family, src, unicodeRange, weight, style}) => {
            const fontFace = new FontFace(
                family, 
                src, 
                {
                    unicodeRange,
                    weight,
                    style
                }
            );

            const addFont = new Promise((resolve, reject) => {
                fontFace.load()
                    .then(fontFace => {
                        document.fonts.add(fontFace);
                        resolve(fontFace);
                    })
                    .catch(reason => {
                        console.log(reason)
                        reject(reason);
                    })
            });

            p.push(addFont)
        })

            

        const fonts = await Promise.allSettled(p)

        let results = {
            rejected: 0,
            fulfilled: 0,
        }

        
        fonts.forEach(result => {
            results[result.status]++;
        })

        if(results.fulfilled) console.log(`loaded ${results.fulfilled} font face(s)`)
        if(results.rejected) console.log(`failed to load ${results.rejected} font face(s)`)

        return fonts;
    }catch(e){
        throw e;
    }
    
}