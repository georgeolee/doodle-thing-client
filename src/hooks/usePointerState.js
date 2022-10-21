import { useEffect, useRef } from "react";


/**
 * 
 * @param {React.MutableRefObject} elementRef 
 * @param {{listenerTarget?:React.MutableRefObject | HTMLElement, , onChange?:function}} options 
 * @returns
 */
export function usePointerState(
    elementRef, //ref object for target element
    options = {           
    }){

    const{
        listenerTarget = document.documentElement,
        onChange,
    } = options


    const pointer = useRef({        
        xNorm: null,
        yNorm: null,
        last: null,        
        isPressed: null,
        timestamp: null,
    })
    

    //add listeners to track pointer movement & buttons
    useEffect(()=>{

        const events = ['pointerdown', 'pointerup', 'pointermove']
        const updatePointerState = (evt) => {
        
            const rect = elementRef.current.getBoundingClientRect()
    
            const c = pointer.current
                        
            delete c.last   //delete first to avoid recursion
            c.last = {...c} //last state
            
            //normalized coords in canvas space
            c.xNorm = (evt.clientX - rect.left) / rect.width
            c.yNorm = (evt.clientY - rect.top) / rect.height
                        
            c.isPressed = evt.buttons > 0 && (evt.target === elementRef.current) //only count presses that target the canvas
            c.timestamp = Date.now()

            onChange?.(c);
        }

        
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
        

        
    }, [listenerTarget, onChange, elementRef])

    return pointer;
}