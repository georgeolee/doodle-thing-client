export function Track(props){

    const {
        r1,
        r2,
        width,
        height,
        t1,
        t2,
        fill,
        stroke,
        strokeWidth
    } = props



    return(
        <svg
            style={{
                width: '100%',
                paddingLeft: `${(height/width)*0.5*100}%`,
                aspectRatio: width/height,
            }}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"  
            >

            
            <path //TRACK IMAGE
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                d={ `M ${t1.x} ${height*0.5 + t1.y}` + 
                    `A ${r1} ${r1} 0 ${r1 < r2 ? 0 : 1} 1 ${t1.x} ${height*0.5 - t1.y}` +
                    `L ${t2.x} ${height*0.5 - t2.y}` + 
                    `A ${r2} ${r2} 0 ${r1 < r2 ? 1 : 0} 1 ${t2.x} ${height*0.5 + t2.y}` +
                    `Z`
                }
                ></path>                          
        </svg>
    )
}