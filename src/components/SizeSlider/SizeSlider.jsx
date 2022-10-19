import { useCallback, useState, useRef, useEffect } from "react";
import { useNoTouch } from "../../hooks/useNoTouch";
import { Thumb } from "./Thumb";
import { Track } from "./Track";


import { useDispatch } from "react-redux";

import { 
    SESSION_INITIAL_SIZE_SLIDER_PROGRESS, 
    updateSizeSliderProgress 
} from "../../redux/sessionStorage/sessionStorageSlice";

export function SizeSlider(props){


    const sliderRef = useRef()

    const dispatch = useDispatch();

    //disable default touch events
    useNoTouch(sliderRef)

    const {
        id,
        onProgress,
    } = props;

    

    const [progress, setProgress] = useState(typeof SESSION_INITIAL_SIZE_SLIDER_PROGRESS === 'number' ? SESSION_INITIAL_SIZE_SLIDER_PROGRESS : 0.5) //0 – 1

    //dispatch progress to session slice
    useEffect(() => {
        dispatch(updateSizeSliderProgress(progress))
    }, [progress, dispatch])


    //handle slider progress change
    useEffect(()=> {
        onProgress?.(progress)
    }, [progress, onProgress])

    //track colors
    const stroke = '#aaa'
    const fill = '#eee'

    //SVG units
    const 
        r1 = 0.5,   //start radius
        r2 = 6,     //end radius
        w = 100,    //total width including radii (excluding stroke)
        d = w - r1 - r2, //dist between centers
        strokeWidth = 0.3

    const [width, height] = [w + strokeWidth, Math.max(r1, r2) * 2 + strokeWidth]

    const theta = -1 * Math.atan2(r2 - r1, Math.sqrt(d**2 - (r2 - r1)**2)) // angle between 1) line connecting center points and 2) common external tangent

    //rotate point (x,y) around (0,0) by radians
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


    const childProps = {
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
    }


    return(
        <div
            id={id}
            ref={sliderRef}
            style={{
                position: 'relative',
                display: 'flex',
                flex: 1,
                // width: 'auto',
                // height: 'auto'
                // width: '300px',
                aspectRatio: width / height,
            }}>

            <Track {...childProps} />
            <Thumb {...childProps} setProgress={setProgress}/>
        </div>
    )
}