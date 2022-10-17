// import { useEffect } from 'react';
import './App.css';
import { socket, connectToServer } from './app/socket';

import { Canvas } from './components/Canvas/Canvas';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { useEffect } from 'react';
import { Log } from './components/Log/Log';
import { SizeSlider } from './components/SizeSlider/SizeSlider';


import { useDispatch } from 'react-redux';
import { setLineWidth } from './app/state/drawingSettings/drawingSettingsSlice';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { EmitUserData } from './components/Users/EmitUserData';
import { ReceiveUserData } from './components/Users/ReceiveUserData';

// import { useSelector } from 'react-redux';


function App() {

  const dispatch = useDispatch()
  const colors = ['erase','#222', '#f44', '#2df', '#fd4', '#555', '#ac4', '#113', '#cfd'];

  



  useEffect(() => {

    console.log('opening socket connection')
    
    //open socket connection to the server
    const cleanup = connectToServer()
   

    //send explicit disconnect message to server

    //...before leaving the page
    window.addEventListener('beforeunload', cleanup)

    //...before rerendering the app
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
        socket?.emit('click')
        }}>click me</button>

      <Log/>

      {/* <h1>{color }</h1> */}

      <EmitUserData/>
      <ReceiveUserData/>
      
      <div style={{position: 'relative', display:'flex'}}>
        <LoadingScreen/>
        <Canvas/>                    
      </div>      

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
