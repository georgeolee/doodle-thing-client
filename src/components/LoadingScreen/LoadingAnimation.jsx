import { useMemo } from "react";

export function LoadingAnimation(props){


    const anim = useMemo(() => {
        
        const strokeWidth= '8%';
        const periods = 1.37;
        const entries = 65;
        const viewBoxWidth = 2.5;
        const paddingX = 0.25;
        const paddingY = 0.3
        const width = viewBoxWidth - 2*paddingX;

        const amplitude = 0.2;

        const viewBoxHeight = 2 * (amplitude + paddingY)

        const step = (Math.PI*2) / (entries);

        const c0 = '#888', c1= '#666';


        //table of sine values
        const table = [];
        for(let n = 0; n < entries; n++){
            const angle = (n*step)%(Math.PI*2);
            const sin = Math.sin(angle);
            table.push(sin);
        }        


        const offsetTable = (offset) => [...table.slice(offset, table.length), ...(offset > 0 ? table.slice(0, offset) : []),]


        //generate a path d attribute from sine table, offset by n entries
        const dWithOffset = (offset) => {                                                        

            const t = offsetTable(offset);

            for(let n = 1; n < Math.ceil(periods); n++){
                t.push(...t)
            }

            let frac = Math.ceil(periods) - periods;
            if(frac){
                
                const n = Math.round(table.length * frac) // # entries to slice off
                t.splice(-n)
            }

            const dx = width / (t.length - 1);

            //start
            // let x = (vi - width) * 0.5;
            let x = paddingX;
            let y = t[0];

            let d = `M ${x},${y * amplitude}`

            d = t.reduce((p, n, i) => {
                if(i === 0) return p;
                return p + ` L ${x + i*dx},${n * amplitude}`
            }, d)

            return d
        }


        //copy first entry for looping back around
        const ds = new Array(entries).fill(null).map((val, i) => dWithOffset(i))
        ds.push(ds[0])

        const sy = 0.2;


        return(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 ${viewBoxHeight * -0.5} ${viewBoxWidth} ${viewBoxHeight}`}>
                <defs>
                    <linearGradient id='wave-gradient'>
                        <stop offset='0%'>
                            <animate
                                attributeName="stop-color"
                                values={`${c0};${c1};${c0}`}
                                dur='1s'
                                repeatCount='indefinite'/>
                        </stop>
                        <stop offset="100%">
                            <animate
                                    attributeName="stop-color"
                                    values={`${c1};${c0};${c1}`}
                                    dur='1s'
                                    repeatCount='indefinite'/>
                        </stop>
                    </linearGradient>
                    {/* <filter id='drop-shadow' y='-5' height='10' width='200%' filterUnits='boundingBox'>
                        
                        <feDropShadow dx={0} dy={0.05} floodColor='#888' floodOpacity={0.5}  stdDeviation={0.05}/>
                    </filter> */}
                </defs>
                <path                    
                    fill="none"
                    stroke="url('#wave-gradient')"
                    // stroke='#000'
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    // filter="url('#drop-shadow')"
                    >
                    <animate
                        attributeName="d"
                        values={ds.reduce((p, n) => p + ';' + n)}
                        dur='2s'
                        repeatCount='indefinite'/>
                </path>
            </svg>
        )
    }, [])

    return anim;
}