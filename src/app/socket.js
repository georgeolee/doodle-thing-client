/**
 *  global socket stuff
 * 
 * 
 */

import {io} from 'socket.io-client';

// const SERVER_URL = 
//     process.env.NODE_ENV === 'production'?
//         'https://doodle-thing.herokuapp.com/' :
//         'http://localhost:8080'



//socket instance
export let socket = null;

//send drawing data to server
export const sendDrawingData = (data) => socket?.emit('drawingData', JSON.stringify(data));

//handler function to call on receiving drawing data from server
let onReceiveDrawingData = null;

//set handler from elsewhere in the app
export const setDrawingDataListener = (fn = null) => {
    if(typeof fn !== 'function' && fn !== null) return console.log(`setDrawingDataListener: expected null or function argument; got ${typeof fn} instead`);
    onReceiveDrawingData = fn;
}

//establish socket connection & set up socket events
export function connectToServer(){

    if(socket?.connected) return console.log('already connected to server');
    
    socket = io(process.env.REACT_APP_SERVER_URL, {transports: ['websocket', 'polling']})            

    socket.on('confirmation', () => {
        console.log(`connected to server at ${process.env.REACT_APP_SERVER_URL}`)
        console.log(`socket id: ${socket.id}`)
    })

    //incoming drawing data from server (other clients drawing)
    socket.on('drawingData', drawingData => onReceiveDrawingData?.(drawingData))

    //return disconnect function
    return () => {
        socket.off();
        socket.disconnect();
    }
}

