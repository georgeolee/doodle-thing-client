// import { useEffect } from 'react';
import './App.css';
import { socket } from './socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';

function App() {

  let colors = ['#000', '#f88', '#df2']

  let drawingSettings = {
    color: colors[0],
    lineWidth: 1
  }

  // useEffect(() => {
  //   connectToServer()
  // }, [])


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
      <Canvas drawingSettings={drawingSettings}></Canvas>
      <ColorPicker 
        colors={colors} 
        onColorPick={c => {
          drawingSettings.color=[c]
        }}/>
    </div>
  );
}

export default App;
