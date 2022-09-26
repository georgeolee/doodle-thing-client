import { useEffect, useRef, useState } from "react"
import { Doodler } from "./Doodler.mjs"

import { usePointerState } from "./usePointerState"

import { socket, pointerStateHandlers, dataRequestHandlers } from "../../socket"

import { getServerCanvasData } from "../../getServerCanvasData.js"

import './canvas.css'

export function Canvas(props){

    const{
        drawingSettings
    } = props

    const canvasRef = useRef()

    const doodlerRef = useRef()

    const [canvasSnapshot, setCanvasSnapshot] = useState(null)

    console.log('canvas render')

    usePointerState(canvasRef, {
        events:['pointermove', 'pointerdown', 'pointerup'],
        onChange: pointerState => {
            if(pointerState.isPressed || pointerState.last?.isPressed){
                doodlerRef.current?.consumePointerStates(pointerState)


                //emit socket event
                socket?.emit('pointerState', JSON.stringify(pointerState))
            }            
        },
        drawingSettings: drawingSettings.current
    })

    

    useEffect(()=>{
        doodlerRef.current = new Doodler(canvasRef, drawingSettings)
        
        pointerStateHandlers.pop()

        //on drawing data from server
        pointerStateHandlers.push(pointerState => {
            doodlerRef.current.consumePointerStates(JSON.parse(pointerState))
        })        

        console.log(`pstatehandler ${pointerStateHandlers.length}`)


        //BAD!! CLEAN UP!!
        dataRequestHandlers.pop()

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

            try{
                fetch(process.env.REACT_APP_SERVER_URL + process.env.REACT_APP_SERVER_CANVAS_DATA_ROUTE, {
                    method: 'POST',                
                    body: JSON.stringify(data),                
                    // keepalive:true
                })
            }catch(e){
                console.log('canvas POST error')
                console.log(e)
            }       
        })


    },[drawingSettings])


    useEffect(() => {
        console.log('useeffect - canvas snapshot change')
        if(!canvasSnapshot || !canvasSnapshot.dataURL){
            console.log('no snapshot or empty')
            console.log(canvasSnapshot)
            console.log('returning w/o setting canvas')
            return
        }


        console.log('has snapshot')
        console.log('snapshot')
        const img = new Image(canvasSnapshot.width, canvasSnapshot.height)
        img.src = canvasSnapshot.dataURL
        const cnv = canvasRef.current
        const ctx = cnv.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, cnv.width, cnv.height)

        // canvasRef.current.
    }, [canvasSnapshot])


    useEffect(() => {
        getServerCanvasData(
          data=>{
            console.log(data)
            setCanvasSnapshot(data)
          },
          error=>{
            console.log(error)
          }
    )}, [canvasSnapshot?.dataURL])


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

    useEffect(() => {
        console.log(`canvas render ${Date.now()}`)   
        console.log(`socket id: ${socket?.id}`)
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