
import './App.css';
import { connectToServer } from '../../socket';

import { Canvas } from '../../components/Canvas/Canvas';
import { ColorPicker } from '../../components/ColorPicker/ColorPicker';
import { useEffect } from 'react';
import { Log } from '../../components/Log/Log';
import { SizeSlider } from '../../components/SizeSlider/SizeSlider';


import { useDispatch } from 'react-redux';
import { setLineWidth } from '../../redux/drawingSettings/drawingSettingsSlice';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';
import { EmitUserData } from '../../components/Users/EmitUserData';
import { ReceiveUserData } from '../../components/Users/ReceiveUserData';
import { UserList } from '../../components/Users/UserList';
import { UserSelf } from '../../components/Users/UserSelf';
import { Outlet, Link } from 'react-router-dom';



function App() {

  const dispatch = useDispatch()
  const colors = [
    // 'erase','#222', '#f44', '#2df', '#fd4', '#555', '#ac4', '#113', '#cfd'
   'erase','#111523ff','#3a4c5cff','#628395ff','#97c1b9ff','#ccffddff','#e6a291ff','#ff4444ff','#ed7957ff','#dbad6aff','#d4d6a4ff',

  '#ece5f0ff','#d3cbbdff','#fbaf00ff','#867a24ff','#4b6036ff','#2e533fff','#104547ff','#112324ff','#111212ff','#110000ff'
  ];

  



  //open socket connection to the server
  useEffect(() => {

    console.log('opening socket connection')
    
    
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
    // console.log(`app render : ${Date.now()}`)
    // console.log(`socket id: ${socket?.id}`)

  })


  return (
    <div className="App">

      <Log/>

      <EmitUserData/>
      <ReceiveUserData/>
      
      <div className='user-panel'>
        <UserSelf/> 
        <Link 
          to='settings'
          className='settings-link'
          >settings</Link>  
      </div>
      
      
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
      
      <label htmlFor="size-slider">pen size</label>
      <UserList/>

      <Outlet/>
    </div>
  );
}

export default App;
