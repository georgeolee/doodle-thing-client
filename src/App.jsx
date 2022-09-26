// import { useEffect } from 'react';
import './App.css';
import { socket, connectToServer } from './socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { useEffect, useState, useRef } from 'react';
import { getServerCanvasData } from './getServerCanvasData';



function App(props) {

  let colors = ['#000', '#f88', '#df2']

  const drawingSettings = useRef({
    color: colors[0],
    lineWidth: 1 * devicePixelRatio
  })


  useEffect(() => {
    console.log('opening socket connection')
    const cleanup = connectToServer()

    return () => {
      console.log('disconnecting socket')
      cleanup()
    }
  }, [])


  useEffect(()=>{
    console.log(`app render : ${Date.now()}`)
    console.log(`socket id: ${socket?.id}`)
  })
  
  
  

  return (
    <div className="App">
      
      <button onClick={()=> {
        socket?.emit('click', Date.now())
        }}>click me</button>

      <Canvas 
        drawingSettings={drawingSettings}></Canvas>
      <ColorPicker 
        colors={colors} 
        onColorPick={c => {
          drawingSettings.current.color=[c]
        }}/>
    </div>
  );
}

export default App;
