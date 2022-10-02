import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useNoTouch } from "../../hooks/useNoTouch";
import { Thumb } from "./Thumb";
import { Track } from "./Track";

export function SizeSlider(props){


    const sliderRef = useRef()

    //disable default touch events
    useNoTouch(sliderRef)

    const {
        id,
        onProgress,
        drawingSettings,
    } = props;

    const [progress, setProgress] = useState(0.5)


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


    const settings = {
        r1,
        r2,
        t1,
        t2,
        width,
        height,
        strokeWidth,
        stroke,
        fill,
        progress,
        containerRef: sliderRef,
        drawingSettings,
    }


    return(
        <>
        <div
            id={id}
            ref={sliderRef}
            style={{
                position: 'relative',
                display: 'flex',

                width: 'auto',
                height: 'auto'
            }}>

            <Track {...settings} />
            <Thumb {...settings} setProgress={setProgress}/>
        </div>
        <label htmlFor={id} style={{fontSize:'12px', textAlign:"center"}}>drag to adjust brush size</label>
        </>
    )
}