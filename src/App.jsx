// import { useEffect } from 'react';
import './App.css';
import { socket, connectToServer } from './socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { useEffect } from 'react';
import { Log } from './components/Log/Log';
import { SizeSlider } from './components/SizeSlider/SizeSlider';


import { useDispatch } from 'react-redux';
import { setLineWidth } from './app/state/drawingSettings/drawingSettingsSlice';

function App() {

  const dispatch = useDispatch()
  let colors = ['erase','#222', '#f44', '#2df', '#fd4', '#555', '#8a8']

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

      <Log/>

      <Canvas/>
      <ColorPicker 
        colors={colors} 
        initialColor={2}/>

      <SizeSlider
        id='size-slider'
        onProgress={progress => {
          const brushSize = document.getElementById('brush-size-indicator').getBoundingClientRect().height 
          dispatch(setLineWidth(brushSize))
        }}
        />
      <label htmlFor="size-slider">drag to change brush size</label>
    </div>
  );
}

export default App;
