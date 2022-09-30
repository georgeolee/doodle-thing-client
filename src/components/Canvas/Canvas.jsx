import { useEffect, useRef, useState } from "react"
import { Doodler } from '../../Doodler.js'

import { usePointerState } from "../../hooks/usePointerState"

import { socket, pointerStateHandlers } from "../../socket"

import { getServerCanvasData } from "../../getServerCanvasData.js"

import './canvas.css'

export function Canvas(props){

    const{
        drawingSettings
    } = props

    const canvasRef = useRef()

    const doodlerRef = useRef()

    //image blob from server
    const blob = useRef(null)

    //canvas timestamp sent from server
    const [timestamp, setTimestamp] = useState()

    console.log('canvas render')

    //every render
    //  - configure canvas listeners 
    //  - set up callback to send outgoing drawing data to socket
    //
    //RENAME : PointerState —> PenState or something (includes drawing settings w/ pointer data)
    usePointerState(canvasRef, {
        events:['pointermove', 'pointerdown', 'pointerup'],
        onChange: pointerState => {
            //don't bother emitting to other sockets if not actually drawing
            if(pointerState.isPressed || pointerState.last?.isPressed){
                //draw here
                doodlerRef.current?.consumePointerStates(pointerState)


                //emit socket event so other clients can draw the same thing
                socket?.emit('pointerState', JSON.stringify(pointerState))
            }            
        },
        drawingSettings: drawingSettings.current
    })

    

    //initial render only (see note below)
    //  - initialize doodler
    //  - set up callback to process incoming drawing data from socket
    useEffect(()=>{
        doodlerRef.current = new Doodler(canvasRef)
        

        //CLEANUP THIS SECTION - array prob not necessary
        pointerStateHandlers.pop()

        //on drawing data from server
        pointerStateHandlers.push(pointerState => {
            doodlerRef.current.consumePointerStates(JSON.parse(pointerState))
        })        

        console.log(`pstatehandler ${pointerStateHandlers.length}`)


        //note - object ref to drawingSettings shouldn't ever change, only properties
        //including here to keep linter happy
    },[drawingSettings])




    useEffect(() => {
        getServerCanvasData({
            onSuccess: (data, ts) =>{
                console.log(data)
                console.log(ts)                

                //check incoming timestamp for canvas data change
                if(ts !== timestamp){
                    
                    blob.current = data;

                    console.log('updating timestamp')
                    setTimestamp(ts)
                }else{
                    console.log('no timestamp change')
                }

              },

            onError: error=>{
                console.log('Canvas.jsx: failed to fetch canvas data. Error:',error)
            },

            query: {
                width: canvasRef.current.width,
                height: canvasRef.current.height,
            }

    })}, [timestamp])


    //on timestamp change
    // - draw server canvas blob to screen if it exists
    useEffect(()=>{        

        const cnv = canvasRef.current
        const ctx = cnv.getContext('2d')


        if(!blob.current) return
      
        (async () => {                                
            
            if(typeof createImageBitmap === 'function'){
                const bmp = await createImageBitmap(blob.current)
                ctx.drawImage(bmp, 0, 0, cnv.width, cnv.height)
                bmp.close()
            }else{
                //for older versions of safari etc that don't support ImageBitmap
                const img = new Image()
                const url = URL.createObjectURL(blob.current)
                img.src = url

                //wait until it's safe to draw image
                await img.decode()

                ctx.drawImage(img, 0, 0, cnv.width, cnv.height)
                URL.revokeObjectURL(url)  
                img.remove()
            }            

        })()

        
    }, [timestamp])

    //every render
    // - set up drawing context
    useEffect(() => {
        canvasRef.current.getContext('2d')
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