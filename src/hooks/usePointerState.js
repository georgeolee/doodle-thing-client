import { useEffect, useRef } from "react";


/**
 * 
 * @param {React.MutableRefObject} elementRef 
 * @param {{events:string[], listenerTarget:React.MutableRefObject | HTMLElement}} options 
 * @returns
 */
export function usePointerState(
    elementRef, //ref object for target element
    options = {   
        // events,
        // listenerTarget
    }){

    const{
        events = ['pointerdown', 'pointerup', 'pointermove'],
        listenerTarget = document.documentElement,
        onChange,
        drawingSettings
    } = options

    const pointer = useRef({
        x: null,
        y: null,
        xNorm: null,
        yNorm: null,
        last: null,
        type: null,
        buttons: null,
        isPressed: null,
        timestamp: null,
        drawingSettings: drawingSettings,
        // count: 0,
    })

    function updatePointerState(evt){
        
        const rect = elementRef.current.getBoundingClientRect()

        const c = pointer.current
        delete c.last
        c.last = {...c}
        c.x = evt.clientX - rect.left
        c.y = evt.clientY - rect.top
        c.xNorm = (evt.clientX - rect.left) / rect.width
        c.yNorm = (evt.clientY - rect.top) / rect.height
        c.type = evt.type
        c.buttons = evt.buttons
        c.isPressed = c.buttons > 0
        c.timestamp = Date.now()
        // c.count++

        // console.log(c.count)

        onChange?.(c);
    }

    useEffect(()=>{

        // element to attach listeners to 

        const target = listenerTarget['addEventListener'] ? listenerTarget : listenerTarget.current

        // attach listeners
        for(const type of events){
            target.addEventListener(type, updatePointerState, {
                capture: true,
                passive: true
            })
        }

        return () => {
            // remove listeners
            for(const type of events){
                target.removeEventListener(type, updatePointerState, {
                    capture: true,
                    passive: true
                })
            }
        }
    })

    return pointer;
}