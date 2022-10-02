import { useEffect } from "react"

/**
 * Prevent default touch handlers from firing
 * @param {React.MutableRefObject<HTMLElement> | HTMLElement} target 
 * @param {string[]} events 
 * @returns 
 */
export function useNoTouch(target = null, events=['touchstart', 'touchmove', 'touchend', 'touchcancel']){
    
    function onTouchStart(e){
        e.preventDefault()
    }

    function onTouchEnd(e){
        e.preventDefault()
    }

    function onTouchMove(e){
        e.preventDefault()
    }

    function onTouchCancel(e){
        e.preventDefault()
    }

    function noDefault(e){
        e.preventDefault()
    }

    useEffect(()=>{
     
        if(!target) return

        const elt = target.addEventListener ? target : target.current

        const handler = {}

        for(const event of events){
            handler[event] = noDefault.bind()

            elt.addEventListener(event, handler[event], {passive:false})
        }


        return () =>{
            for(const event of events){
                elt.removeEventListener(event, handler[event], {passive:false})
            }
        }
    })

    return {
        onTouchStart,
        onTouchEnd,
        onTouchMove,
        onTouchCancel
    }
}