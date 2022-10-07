import { useEffect, useRef, useState } from "react"
import { Doodler } from '../../Doodler.js'

import { usePointerState } from "../../hooks/usePointerState"

import { setDrawingDataListener, sendDrawingData } from "../../app/socket"

import { getServerCanvasData, getServerCanvasTimestamp } from "../../getServerCanvasData.js"

import './canvas.css'
import { useNoTouch } from "../../hooks/useNoTouch.js"


//redux
import { useSelector, useDispatch } from "react-redux";
import { selectColor, selectEraser, selectLineWidth } from "../../app/state/drawingSettings/drawingSettingsSlice.js";
import { setStatus } from "../../app/state/canvas/canvasSlice.js"

export function Canvas(){

    const dispatch = useDispatch();

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
    usePointerState(canvasRef, {
        onChange: pointerState => {
            
            //don't bother emitting to other sockets if not actually drawing
            if(pointerState.isPressed || pointerState.last?.isPressed){

                const drawingData = {...pointerState, drawingSettings: drawingSettings.current}

                //draw here
                doodlerRef.current?.consumeDrawingData({...pointerState, drawingSettings: drawingSettings.current})

                //emit socket event so other clients can draw the same thing
                sendDrawingData(drawingData);

            }                       
        },

    })

    //initial render only (see note below)
    //  - initialize doodler
    //  - set up callback to process incoming drawing data from socket
    useEffect(()=>{

        console.log('canvas render')

        doodlerRef.current = new Doodler(canvasRef)
        
        setDrawingDataListener(drawingData => doodlerRef.current.consumeDrawingData(JSON.parse(drawingData)))

        return () => {
            console.log('canvas unrender')
            doodlerRef.current = null;
            setDrawingDataListener(null);
        }
    },[])




    useEffect(() => {

            const controller = new AbortController();
            const signal = controller.signal;

            //
            const boundUnload = window.onbeforeunload?.bind(window);
            let cancelFetchRequest = () => controller.abort('page unload');

            //cancel the fetch request if the user leaves/refreshes the page before it completes
            window.onbeforeunload = (e) => {
                boundUnload?.(e);
                cancelFetchRequest?.();
            }


            (async () => {
                
                dispatch(setStatus('requesting canvas timestamp...'));

                if(timestamp){
                    const serverTimestamp = await getServerCanvasTimestamp({signal});                                        
                    //no timestamp change
                    if(serverTimestamp === timestamp){ 
                        cancelFetchRequest = null;  
                        dispatch(setStatus('ready'));                      
                        return;
                    }
                }

                dispatch(setStatus('fetching canvas data...'));

                try{
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
                            
                            cancelFetchRequest = null;
                            dispatch(setStatus('ready'));
    
                          },
            
                        query: {
                            width: canvasRef.current.width,
                            height: canvasRef.current.height,
                        },
    
                        signal
    
                    }).catch(e => {
                        console.log('IN PROMISE: ', e)
                        if(e.willRetry === true){
                            dispatch(setStatus('waiting for server to wake up...'))
                        }else{
                            cancelFetchRequest = null;
                            dispatch(setStatus('ready'));
                        }
                    })
                }catch(e){
                    console.log('IN CATCH BLOCK: ', e)
                    if(e.willRetry === true){
                        dispatch(setStatus('waiting for server to wake up...'))
                    }else{
                        cancelFetchRequest = null;
                        dispatch(setStatus('ready'));
                    }
                }
                

            })()


            return () => {
                controller.abort('component rerender')
                cancelFetchRequest = null;
            }

        }, [timestamp])


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
            }}
            ref={canvasRef}            
            ></canvas>
    )
}