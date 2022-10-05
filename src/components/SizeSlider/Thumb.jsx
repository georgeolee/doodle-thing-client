import { useCallback } from 'react'
import {useRef} from 'react'

import { useSelector } from 'react-redux'
import { selectColor, selectEraser } from '../../app/state/drawingSettings/drawingSettingsSlice'

export function Thumb(props){

    //access redux store
    const color = useSelector(selectColor);
    const isErase = useSelector(selectEraser);

    const {

        width,
        height,
        strokeWidth,
        progress,
        setProgress,
        containerRef
    } = props

    const stroke = '#666';

    const thumbPadding= 0.97;
    
    const lastInteractionRef = useRef({
        clientX: null,
        pressed: null,
    })

    const thumbRef = useRef()

    
    const update = useCallback(e => {
        lastInteractionRef.current = {
            clientX: e.clientX,
            pressed: !!e.buttons || e.button >= 0
        }
    }, [])
    

    return(

        //attach events to div instead
        <div
            style={{
                position: 'absolute',
                // display: 'flex',     
                height: '100%',
                aspectRatio: 1,
                // left: `${100 * progress}%`
                left: `calc(${(100 - 100*(height - strokeWidth)/width) * progress}%` //offset by thumb width
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

                const dx = e.clientX - lastInteractionRef.current.clientX;
                
                //interacting w/ slider?
                if(pressed && lastInteractionRef.current.pressed && dx){                    
                

                    //total wrapper width
                    const containerWidth = containerRef.current.getBoundingClientRect().width

                    //thumb size
                    const thumbWidth = thumbRef.current.getBoundingClientRect().width

                    //slideable portion of wrapper width
                    const trackWidth = containerWidth - thumbWidth

                    //dx normalized to 0-1 range
                    const dxn = dx / trackWidth

                    //clamp progress
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
                }}
                viewBox={`0 0 ${height} ${height}`}
                xmlns="http://www.w3.org/2000/svg"  
                >


                <g>
                    
                    <circle //dotted line around brush indicator 
                        cx='50%' cy='50%'
                        r={`${height/2 - strokeWidth}`}
                        // stroke={stroke}
                        stroke='#888'
                        strokeDasharray='2.1 2.5'

                        // strokeLinecap='round'
                        strokeWidth={strokeWidth * 2}
                        fill='none'                  
                        ></circle>

                    <circle //match brush size & color
                        id='brush-size-indicator'
                        cx='50%' cy='50%'
                        r={`${( (height - (2*(strokeWidth + thumbPadding))) * 0.5)*progress}`}
                        stroke={stroke}
                        strokeWidth={isErase ? strokeWidth : strokeWidth * 0.25}
                        fill={isErase? 'none' : color}
                        ></circle>
                </g>
            </svg>
        </div>
        
    )
}