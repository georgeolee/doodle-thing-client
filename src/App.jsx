// import { useEffect } from 'react';
import './App.css';
import { socket } from './socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { useEffect, useState } from 'react';
import { getServerCanvasData } from './getServerCanvasData';

function App(props) {

  let colors = ['#000', '#f88', '#df2']

  let drawingSettings = {
    color: colors[0],
    lineWidth: 1
  }

  const [canvasSnapshot, setCanvasSnapshot] = useState(null)

  console.log(`app render : ${Date.now()}`)

  useEffect(() => {
    getServerCanvasData(
      data=>{
        setCanvasSnapshot(data)
      },
      error=>{
        console.log(error)
      }
)}, [])

  return (
    <div className="App">
      <button onClick={()=> {
        socket?.emit('click', Date.now())
        
        // const c = document.querySelector('canvas')

        // console.log(c)

        // if(c){
          
        //   const a = document.createElement('a')
        //   a.setAttribute('href', c.toDataURL())
        //   a.setAttribute('download', 'image')
        //   // c.toDataURL()

        //   console.log(c.toDataURL())

        //   a.click()
          
        // }

        }}>click me</button>
      <Canvas 
        snapshot={canvasSnapshot}
        drawingSettings={drawingSettings}></Canvas>
      <ColorPicker 
        colors={colors} 
        onColorPick={c => {
          drawingSettings.color=[c]
        }}/>
    </div>
  );
}

export default App;
