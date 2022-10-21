import { useEffect, useRef, useState, useCallback } from "react"
import { Doodler } from '../../Doodler.js'

import { usePointerState } from "../../hooks/usePointerState"

import { setDrawingDataListener, sendDrawingData } from "../../socket"

import { getServerCanvasData, getServerCanvasTimestamp } from "../../getServerCanvasData.js"

import './canvas.css'
import { useNoTouch } from "../../hooks/useNoTouch.js"

//redux
import { useSelector, useDispatch } from "react-redux";

import { setStatus, selectPreferNativePixelRatio } from "../../redux/canvas/canvasSlice.js"
import { useStatusWithTimeout } from "../../hooks/useStatusWithTimeout.js"

import { selectOwnId, selectOwnConnected } from "../../redux/user/userSlice.js"

import { store } from "../../redux/store.js"

import {useBeforeUnload} from '../../hooks/useBeforeUnload.js'

export function Canvas(){

    const dispatch = useDispatch();

    const preferNativePixelRatio = useSelector(selectPreferNativePixelRatio);

    const canvasRef = useRef()
    useNoTouch(canvasRef)
    
    const doodlerRef = useRef()

    //image blob from server
    const blob = useRef(null)

    //canvas timestamp sent from server
    const [timestamp, setTimestamp] = useState()

    const setStatusWithTimeout = useStatusWithTimeout()    
    
    const id = useSelector(selectOwnId)
    const connected = useSelector(selectOwnConnected)

    //set a listener to cancel any active fetch request if user leaves or refreshes the page
    const setUnloadListener = useBeforeUnload();


    //every render
    //  - configure canvas listeners 
    //  - set up callback to send outgoing drawing data to socket
    usePointerState(canvasRef, {
        onChange: useCallback(pointerState => {
            
            //don't bother emitting to other sockets if not actually drawing
            if(pointerState.isPressed || pointerState.last?.isPressed){


                const drawingData = {

                    //  x / y / pressed / last
                    ...pointerState, 

                    //  color / lineWidth / eraser
                    drawingSettings: store.getState().drawingSettings,

                    //TODO - option to overlay usernames while drawing ; use 2nd (offscreen?) canvas
                    id
                }

                //draw client side                
                doodlerRef.current?.consumeDrawingData(drawingData)

                //emit to server
                sendDrawingData(drawingData);

                if(pointerState.isPressed) setStatusWithTimeout('drawing', 200)

            }                       
        },[setStatusWithTimeout, id])
    })


    //initial render only (see note below)
    //  - initialize doodler
    //  - set up callback to process incoming drawing data from socket
    useEffect(()=>{

        doodlerRef.current = new Doodler(canvasRef)        
        setDrawingDataListener(drawingData => doodlerRef.current.consumeDrawingData(drawingData))        

        return () => {
            
            doodlerRef.current = null;
            setDrawingDataListener(null);
        }
    },[])


    //no canvas
    //or
    //yes canvas and connected
    
    //add to deps array to refire hook on reconnect
    const doRefresh = !timestamp || (timestamp && connected)

    useEffect(() => {

            if(!doRefresh) return // don't fetch if disconnected

            const controller = new AbortController();
            const {signal} = controller;

            setUnloadListener(() => controller.abort('page unload'));


            (async () => {
                
                //TODO - possibly bump up timestamp diff threshold ? to avoid getting locked into fetch loop

                dispatch(setStatus('comparing timestamp...'));

                if(timestamp){
                    const serverTimestamp = await getServerCanvasTimestamp({signal});                                        
                    
                    //don't trigger a refetch if timestamp difference less than this
                    const THRESHOLD = 1000;
                    
                    //TODO - buffer input and fetch in background if already have a canvas blob
                    // (avoid getting locked in if other users scribbling during fetch)

                    //timestamp diff within threshold?
                    if(Number(serverTimestamp) - Number(timestamp) <= THRESHOLD){ 
                        dispatch(setStatus('ready'));                      
                        return;
                    }
                }

                dispatch(setStatus('fetching canvas data...'));


                try{
                    const result = await getServerCanvasData({      
                    
                        //request native resolution if device pixel ratio > 1
                        query: preferNativePixelRatio? {   
                            width: canvasRef.current.width,
                            height: canvasRef.current.height,
                        } : {/*use server default (lowest resolution)*/},
    
                        signal,
    
                        updateStatus: (status) => dispatch(setStatus(status))
    
                    });
    
                    //result will be null if fetch request was aborted (eg from a page refresh or rerender)
                    if(result == null){
                        return;
                    }
    
                    const {blob:newBlob, blobTimestamp} = result;
    
                    //check incoming timestamp for canvas data change
                    if(blobTimestamp !== timestamp){                        
                        blob.current = newBlob;
                        setTimestamp(blobTimestamp)                        
                    }

                }catch(e){
                    console.log('error in canvas while fetching canvas data')
                    console.error(e)
                    dispatch(setStatus('ready'));
                }
            
                

            })()


            return () => {
                controller.abort('component rerender')
            }

        }, [
            timestamp, 
            preferNativePixelRatio, 
            doRefresh, 
            dispatch, 
            setUnloadListener
        ]);


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
            onPointerDown={e => e.target.setPointerCapture(e.pointerId)}
            onPointerUp={e => e.target.releasePointerCapture(e.pointerId)}
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