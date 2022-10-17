import { 
    useEffect, 
    useRef,
} from "react";

/**
 * attach an onbeforeunload listener to the window ; uses useRef(), so the listener identity persists between renders
 * @param {function|null} fn initial listener value
 * @returns {function} a setter function to update the listener
 */
export function useBeforeUnload(fn = null){
    const callbackRef = useRef(null);

    const setListener = fn => callbackRef.current = fn;
    

    useEffect(() => {

        const onBeforeUnload = evt => callbackRef?.current(evt);

        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        }
    }, [])

    return setListener;
}