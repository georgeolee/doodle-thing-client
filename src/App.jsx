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
      <button onClick={()=> socket?.emit('click', Date.now())}>click me</button>
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
