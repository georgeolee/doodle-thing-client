// import { useEffect } from 'react';
import './App.css';
import { socket, connectToServer } from './socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { useEffect, useState, useRef } from 'react';
import { Log } from './components/Log/Log';


function App(props) {

  let colors = ['#222', '#f44', '#2df', '#fd4']

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
  
  
  // useEffect(()=>{
  //   setInterval(()=>{
  //     document.getElementById('log').innerText = Math.random()
  //   }, 1000)
  // }, [])

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
          drawingSettings.current.color=[c]
        }}/>
    </div>
  );
}

export default App;
