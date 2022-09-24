import { useEffect, useRef } from "react"
import { Doodler } from "./Doodler"

import { usePointerState } from "./usePointerState"

import { socket, pointerStateHandlers } from "../../socket"
import { Socket } from "socket.io-client"

export function Canvas(props){
    const canvasRef = useRef()

    const doodlerRef = useRef()

    const pointer = usePointerState(canvasRef, {
        events:['pointermove', 'pointerdown', 'pointerup'],
        onChange: pointerState => {
            if(pointerState.isPressed || pointerState.last?.isPressed){
                doodlerRef.current?.consumePointerStates(pointerState)


                //emit socket event
                socket?.emit('pointerState', JSON.stringify(pointerState))
            }            
        }
    })

    console.log('render')

    useEffect(()=>{
        doodlerRef.current = new Doodler(canvasRef)
        pointerStateHandlers.push(pointerState => {
            doodlerRef.current.consumePointerStates(JSON.parse(pointerState))
        })        
    },[])

    // useEffect(()=>{
    //     socket.on()
    // },[])

    //log pointer for debug
    // useEffect(()=>{
    //     setInterval(()=>{
    //         for(const p in pointer.current){
    //             console.log(p,pointer.current[p])
    //         }
    //         console.log(JSON.stringify(pointer.current))
    //         console.log('\n\n')
    //     }, 2000)
    // })

    //need to call this here ; prevents black screen
    useEffect(()=>{        
        canvasRef.current.getContext('2d')
    })

    return(
        <canvas
            width={300 * devicePixelRatio}
            height={300 * devicePixelRatio}
            style={{
                width: 300,
                height: 300,
                border:'1px solid black'
            }}
            ref={canvasRef}            
            ></canvas>
    )
}