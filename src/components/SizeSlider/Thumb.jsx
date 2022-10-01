import { useEffect } from 'react'
import {useRef} from 'react'

export function Thumb(props){



    const {
        r1,
        r2,
        width,
        height,

        runnableWidth,
        leftOffset=0,

        progress,
        setProgress,
        onDeltaX = dx => console.log(`slider dx: ${dx}`),   

        containerRef
    } = props


    const lastMoveRef = useRef({
        clientX: null,
        pressed: null,
    })

    const thumbRef = useRef()

    console.log('thumb')
    return(

        //attach events to div instead
        <div
            style={{
                position: 'absolute',
                // display: 'flex',     
                height: '100%',
                aspectRatio: 1,
                left: `${100 * progress}%`
            }}
            ref={thumbRef}
            className="size-slider-thumb"

            onPointerDown={e => {
                e.target.setPointerCapture(e.pointerId)
            }}

            onPointerUp={e=>{
                e.target.releasePointerCapture(e.pointerId)
            }}

            onPointerMove={e=>{
                const pressed = !!e.buttons

                const dx = e.clientX - lastMoveRef.current.clientX;

                if(pressed && lastMoveRef.current.pressed && dx){
                    onDeltaX(dx)
                }

                lastMoveRef.current = {
                    clientX: e.clientX,
                    pressed: !!e.buttons
                }

                const containerWidth = containerRef.current.getBoundingClientRect().width
                
                //account for dead space ?

                const dxn = dx / containerWidth

                setProgress(Math.max(0, Math.min(progress + dxn, 1)))
            }}

            >
            <svg

            style={{
                display: 'flex',
                flex:1,
                width: '100%',
                height: '100%'
            }}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"  
            >


            {/* <g> */}
                
                <circle
                    cx='50%' cy='50%'
                    r='50%'
                    stroke='none'
                    fill='#8888'                    
                    ></circle>

                <circle
                    cx='50%' cy='50%'
                    r={`${50*progress}%`}
                    stroke='none'
                    fill='#000'                    
                    ></circle>
            {/* </g> */}

            </svg>
        </div>
        
    )
}