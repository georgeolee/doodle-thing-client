import { useMemo } from "react";

export function LoadingAnimation(props){


    const anim = useMemo(() => {
        
        const periods = 2;
        const entries = 65;
        const viewBoxWidth = 2.5;
        const padding = 0.25;
        const width = viewBoxWidth - 2*padding;

        const amplitude = 0.25;

        const viewBoxHeight = 2 * (amplitude + padding)

        const step = (Math.PI*2) * periods / (entries);

        const c0 = '#000', c1= '#666';


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
            const dx = width / (entries - 1);

            const t = offsetTable(offset);

            //start
            // let x = (vi - width) * 0.5;
            let x = padding;
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
                </defs>
                <path
                    fill="none"
                    stroke="url('#wave-gradient')"
                    strokeWidth='8%'
                    strokeLinecap="round"
                    strokeLinejoin="round"
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