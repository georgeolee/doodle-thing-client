import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { usePointerState } from "../../hooks/usePointerState";

export function SizeSlider(props){

    //mobile fix && clean up

    const {
        id,
        onProgress
    } = props;

    const [progress, setProgress] = useState(0.5)
    const svgRef = useRef()
    const thumbRef = useRef()

    const pointer = usePointerState(svgRef, {listenerTarget: svgRef})


    useEffect(()=> {
        onProgress?.(progress)
    })

    const 
        r1 = 1,     //radii
        r2 = 6,

        w = 100,    //total width including radii (excluding stroke)
        d = w - r1 - r2; //dist between centers


    const strokeWidth = 0.5
    const stroke = '#999'
    const fill = '#ddd'

    const [width, height] = [w + strokeWidth, Math.max(r1, r2) * 2 + strokeWidth]

    //circle centers
    const 
        c1 = {
            x: r1 + strokeWidth*0.5,
            y: height*0.5
        },
        c2 = {
            x: r1 + d + strokeWidth*0.5,
            y: height*0.5
        }



    const theta = -1 * Math.atan2(r2 - r1, Math.sqrt(d**2 - (r2 - r1)**2)) // angle between 1) line connecting center points and 2) common external tangent

    //rotate (x,y) around (0,0) by radians
    const rotatePoint = useCallback((x, y, rad) => {
        return{
            x: x * Math.cos(rad) - y * Math.sin(rad),
            y: x * Math.sin(rad) + y * Math.cos(rad)
        }
    }, [])    

    //treat circle center as origin of each rotation, then offset back
    const t1 = rotatePoint(0, r1, theta);
    t1.x = r1 - t1.x //x coord relative to graph left instead of circle center
    t1.x += strokeWidth* 0.5 //compensate for stroke thickness

    //same as above for other point
    const t2 = rotatePoint(0, r2, theta)
    t2.x = d + r1 - t2.x
    t2.x += strokeWidth * 0.5




    //maybe move this stuff to usePointer hook
    useEffect(()=>{

        const noDef = e => e.preventDefault()

        thumbRef.current.addEventListener('touchstart', noDef)
        thumbRef.current.addEventListener('touchmove', noDef)


        return () => {
            thumbRef.current.removeEventListener('touchstart', noDef)
            thumbRef.current.removeEventListener('touchmove', noDef)
        }
    })

    return(
        

        <svg
            id={id}
            ref={svgRef}

            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"  
            pointerEvents='visible'
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

            
            <g  //TRACK COLLIDER
                visibility='hidden'
                strokeWidth={strokeWidth}
                pointerEvents='all'
                onClick={()=> console.log('clicked group')}>

                <polygon
                    points={`
                    ${t1.x},${height*0.5 + t1.y} 
                    ${t1.x} ${height*0.5 - t1.y}
                    ${t2.x} ${height*0.5 - t2.y},
                    ${t2.x} ${height*0.5 + t2.y}`}                
                    ></polygon>
                <circle
                    cx={c1.x}
                    cy={c1.y}
                    r={r1}
                    ></circle>
                <circle
                    cx={c2.x}
                    cy={c2.y}
                    r={r2}
                    ></circle>
            </g>
            
            <g //THUMB
                ref={thumbRef}
                // onPointerDown={e=>{
                //     e.preventDefault()
                //     thumbRef.current.setPointerCapture(e.pointerId)
                // }}
                
                onPointerMove={e=> {
                    // console.log(e.button)
                    // e.preventDefault()
                    if(!pointer.current.isPressed) return
                    thumbRef.current.setPointerCapture(e.pointerId)
                    const rect = svgRef.current.getBoundingClientRect()

                    //don't use this ; use actual rect width
                    // const runnableWidth = rect.width * (w / (d + strokeWidth))
                    console.log('svg g pointermove')
                    //screen width to svg units
                    const runnableWidth = rect.width *  (d + strokeWidth*2 - 2*r2)/(d + strokeWidth*2)

                    // const delta = e.movementX / rect.width;
                    const delta = e.movementX / runnableWidth;



                    const newProgress = Math.max(0, Math.min(progress + delta, 1))

                    setProgress(newProgress)

                }}
                onPointerUp={e=> thumbRef.current.releasePointerCapture(e.pointerId)}
                >
                
                <circle
                    cx={

                        //dead space to the left -> always this far at least
                        r2 +


                        //usable portion of the track
                        progress * (d + strokeWidth*2 - r2) 

                        //dead space to the right -> never goes that far
                        // r2 + strokeWidth*0.5
                    }

                    cy='50%'
                    r={r2}
                    stroke='none'
                    fill='#8888'                    
                    ></circle>

                <circle
                    cx={

                        //dead space to the left -> always this far at least
                        r2 +


                        //usable portion of the track
                        progress * (d + strokeWidth*2 - r2) 

                        //dead space to the right -> never goes that far
                        // r2 + strokeWidth*0.5
                    }

                    cy='50%'
                    r={r2*progress}
                    stroke='none'
                    fill='#000'                    
                    ></circle>
            </g>

        </svg>


    )
}