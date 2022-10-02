// import { useEffect } from 'react';
import './App.css';
import { socket, connectToServer } from './socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { useEffect, useRef } from 'react';
import { Log } from './components/Log/Log';
import { SizeSlider } from './components/SizeSlider/SizeSlider';
import { useState } from 'react';


function App() {

  let colors = ['erase','#222', '#f44', '#2df', '#fd4', '#555', '#8a8']

  const drawingSettings = useRef({
    color: colors[0],
    lineWidth: 1
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
  
  const redraw = {}

  return (
    <div className="App">
      
      <button onClick={()=> {
        socket?.emit('click', Date.now())
        }}>click me</button>

      <Log/>

      <Canvas 
        drawingSettings={drawingSettings}></Canvas>
      <ColorPicker 
        colors={colors} 
        onColorPick={c => {
          drawingSettings.current.color = c
          redraw.slider?.()
        }}/>

      <SizeSlider
        id='size-slider'
        drawingSettings={drawingSettings}
        redraw={redraw}
        onProgress={progress => {
          drawingSettings.current.lineWidth = 
            // document.getElementById('size-slider').getBoundingClientRect().height * progress
            document.getElementById('brush-size-indicator').getBoundingClientRect().height 
        }}
        />
      <label htmlFor="size-slider">drag to change brush size</label>
    </div>
  );
}

export default App;
