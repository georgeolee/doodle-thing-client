import { useEffect } from 'react';
import './App.css';
import { socket, connectToServer } from './socket';

import { Canvas } from './components/Canvas/Canvas';

function App() {

  useEffect(() => {
    connectToServer()
  })


  return (
    <div className="App">
      <button onClick={()=> socket?.emit('click', Date.now())}>click me</button>
      <Canvas></Canvas>
    </div>
  );
}

export default App;
