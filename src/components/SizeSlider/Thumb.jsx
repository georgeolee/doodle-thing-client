import { useCallback } from 'react'
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

    useEffect(()=>{
        console.log(`thumb progress: ${progress}`)
    })
    
    const update = useCallback(e => {
        lastMoveRef.current = {
            clientX: e.clientX,
            pressed: !!e.buttons || e.button >= 0
        }
    })

    return(

        //attach events to div instead
        <div
            style={{
                position: 'absolute',
                // display: 'flex',     
                height: '100%',
                aspectRatio: 1,
                // left: `${100 * progress}%`
                left: `${(100 - 100*height/width) * progress}%`
            }}
            ref={thumbRef}
            className="size-slider-thumb"

            onPointerDown={e => {
                e.target.setPointerCapture(e.pointerId)
                update(e)
            }}

            onPointerUp={e=>{
                e.target.releasePointerCapture(e.pointerId)
                update(e)
            }}

            onPointerMove={e=>{
                const pressed = (!!e.buttons || e.button >= 0)
                // console.log(`pressed: ${pressed}`)


                const dx = e.clientX - lastMoveRef.current.clientX;

                
                //interacting w/ slider
                if(pressed && lastMoveRef.current.pressed && dx){
                    // onDeltaX(dx)
                

                    const containerWidth = containerRef.current.getBoundingClientRect().width
                
                    //account for dead space ?

                    const thumbWidth = thumbRef.current.getBoundingClientRect().width

                    const trackWidth = containerWidth - thumbWidth

                    const dxn = dx / trackWidth

                    // console.log(`dxn: ${dxn}`)

                    
                    setProgress(
                        Math.max(0, 
                            Math.min(progress + dxn, 1)
                            )
                        )


                }

                update(e)

                
            }}

            >
            <svg

            style={{
                display: 'flex',
                flex:1,
                width: '100%',
                // height: '100%'
            }}
            viewBox={`0 0 ${height} ${height}`}
            xmlns="http://www.w3.org/2000/svg"  
            >


            {/* <g> */}
                
                <circle
                    cx='50%' cy='50%'
                    r={`${height/2 - 1}`}
                    strokeWidth='5%'
                    // stroke='none'
                    stroke='#888'
                    strokeDasharray='2 2'
                    // fill='#ff88'  
                    fill='none'                  
                    ></circle>

                <circle
                    id='brush-size-circle'
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