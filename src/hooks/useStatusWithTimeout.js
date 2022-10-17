import { useDispatch } from "react-redux";
import { setOwnStatus } from "../app/state/user/userSlice";
import { useRef } from "react";

let globalTimeout; // shared timeout across components


/**
 * 
 * @returns {(status:string,timeout:number, options:{timeoutStatus:'idle',global:false})=> void}
 */
export function useStatusWithTimeout(){
    const timeoutRef = useRef(null) // timeout local to this component

    const dispatch = useDispatch();

    return (status, timeout, options = {timeoutStatus: 'idle', global: false}) => {
        
        const{timeoutStatus, global} = options;

        clearTimeout(global ? globalTimeout : timeoutRef.current);
        
        if(typeof timeout === 'number'){
            const t = setTimeout(() => {
                dispatch(setOwnStatus(timeoutStatus));
            }, timeout)

            if(global) globalTimeout = t;
            else timeoutRef.current = t;

        } else throw new TypeError(`in ${useStatusWithTimeout.name}(): timeout not of type number`)

        dispatch(setOwnStatus(status));
    }
}