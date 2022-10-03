import { useEffect, useRef, useState } from "react"
import { Doodler } from '../../Doodler.js'

import { usePointerState } from "../../hooks/usePointerState"

import { socket, pointerStateHandlers } from "../../socket"

import { getServerCanvasData } from "../../getServerCanvasData.js"

import './canvas.css'
import { useNoTouch } from "../../hooks/useNoTouch.js"


//redux
import { useSelector } from "react-redux";
import { selectColor, selectEraser, selectLineWidth } from "../../app/state/drawingSettings/drawingSettingsSlice.js";

export function Canvas(){

    


    const canvasRef = useRef()
    useNoTouch(canvasRef)
    
    const doodlerRef = useRef()

    //image blob from server
    const blob = useRef(null)

    //canvas timestamp sent from server
    const [timestamp, setTimestamp] = useState()


    const drawingSettings = useRef()

    //get global state from redux store
    drawingSettings.current = {
        color: useSelector(selectColor),
        lineWidth: useSelector(selectLineWidth),
        eraser: useSelector(selectEraser),
    }

    


    //every render
    //  - configure canvas listeners 
    //  - set up callback to send outgoing drawing data to socket
    //

    //clean this hook up
    usePointerState(canvasRef, {
        events:['pointermove', 'pointerdown', 'pointerup'],
        onChange: pointerState => {
            
            //don't bother emitting to other sockets if not actually drawing
            if(pointerState.isPressed || pointerState.last?.isPressed){
                //draw here
                doodlerRef.current?.consumeDrawingData({...pointerState, drawingSettings: drawingSettings.current})

                //emit socket event so other clients can draw the same thing
                socket?.emit('pointerState', JSON.stringify({...pointerState, drawingSettings: drawingSettings.current}))
            }                       
        },

    })

    //clarify distinction -> pointer data (hook) | drawing data (pointer + color, line width, etc)

    //initial render only (see note below)
    //  - initialize doodler
    //  - set up callback to process incoming drawing data from socket
    useEffect(()=>{
        doodlerRef.current = new Doodler(canvasRef)
        

        //CLEANUP THIS SECTION - array prob not necessary
        pointerStateHandlers.pop()

        //on drawing data from server
        pointerStateHandlers.push(pointerState => {
            doodlerRef.current.consumeDrawingData(JSON.parse(pointerState))
        })        

        console.log(`pstatehandler ${pointerStateHandlers.length}`)

    },[])




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