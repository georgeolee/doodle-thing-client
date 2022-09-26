import { useEffect, useRef } from "react"
import { Doodler } from "./Doodler.mjs"

import { usePointerState } from "./usePointerState"

import { socket, pointerStateHandlers, dataRequestHandlers } from "../../socket"

import './canvas.css'

export function Canvas(props){

    const{
        snapshot,
        drawingSettings
    } = props

    const canvasRef = useRef()

    const doodlerRef = useRef()

    usePointerState(canvasRef, {
        events:['pointermove', 'pointerdown', 'pointerup'],
        onChange: pointerState => {
            if(pointerState.isPressed || pointerState.last?.isPressed){
                doodlerRef.current?.consumePointerStates(pointerState)


                //emit socket event
                socket?.emit('pointerState', JSON.stringify(pointerState))
            }            
        },
        drawingSettings: drawingSettings
    })

    console.log('render')

    useEffect(()=>{
        doodlerRef.current = new Doodler(canvasRef, drawingSettings)
        
        //on drawing data from server
        pointerStateHandlers.push(pointerState => {
            doodlerRef.current.consumePointerStates(JSON.parse(pointerState))
        })        

        //on server request for canvas state
        dataRequestHandlers.push(() => {
            const dataURL = canvasRef.current.toDataURL()
            const timestamp = Date.now()
            const width = canvasRef.current.width
            const height = canvasRef.current.height
            const data = {
                dataURL,
                timestamp,
                width,
                height
            }

            fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE, {
                method: 'POST',                
                body: JSON.stringify(data),                
                keepalive:true
            })
        })


    },[drawingSettings])


    useEffect(() => {
        console.log('canvas useeffect')
        if(!snapshot || snapshot.empty) return
        console.log('has snapshot')
        const img = new Image(snapshot.width, snapshot.height)
        img.src = snapshot.dataURL
        const cnv = canvasRef.current
        const ctx = cnv.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, cnv.width, cnv.height)

        // canvasRef.current.
    })

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
            className="doodle-canvas"
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