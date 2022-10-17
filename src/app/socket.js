/**
 *  global socket.io stuff
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

//send user data to server
export const sendUserData = (data) => {
    // socket?.emit('user', JSON.stringify(data))
    socket?.emit('user', data)

    //TODO - debugging
    const {id, name, status, color} = data
    console.log(`\nin ${sendUserData.name} (socket.js):`)    
    console.log(`id: ${id}\tname: ${name}\tstatus: ${status} color: ${color}\n`)
};


/**handler function to call on receiving drawing data from server*/
let onReceiveDrawingData = null;

/**handler function to call on receiving an id assignment from server */
let onReceiveIdAssignment = null;

let onReceiveUserData = null;

// const listeners = {
//     onReceiveDrawingData,
//     onReceiveIdAssignment,
//     onReceiveUserData
// }

// const setListener = (listener, fn = null) => {
//     if(typeof fn !== 'function' && fn !== null) throw new TypeError(`expected null or function argument; got ${typeof fn} instead`);
//     listener = fn;
// }

//set handler from elsewhere in the app
export const setDrawingDataListener = (fn = null) => {
    if(typeof fn !== 'function' && fn !== null) throw new TypeError(`setDrawingDataListener: expected null or function argument; got ${typeof fn} instead`);
    onReceiveDrawingData = fn;
}

/**set id handler */
export const setIdAssignmentListener = (fn = null) => {
    if(typeof fn !== 'function' && fn !== null) throw new TypeError(`setIdAssingmentListener: expected null or function argument; got ${typeof fn} instead`);
    onReceiveIdAssignment = fn;
}

/**set user data handler */
export const setUserDataListener = (fn = null) => {
    if(typeof fn !== 'function' && fn !== null) throw new TypeError(`setUserDataListener: expected null or function argument; got ${typeof fn} instead`);
    onReceiveUserData = fn;
}

//establish socket connection & set up socket events
export function connectToServer(){

    if(socket?.connected) return console.log('already connected to server');
    
    socket = io(process.env.REACT_APP_SERVER_URL, {transports: ['websocket', 'polling']})            

    socket.on('confirmation', () => {
        console.log(`connected to server at ${process.env.REACT_APP_SERVER_URL}`)
        console.log(`socket id: ${socket.id}`)

        socket.emit()
    })

    //incoming drawing data from server (other clients drawing)
    socket.on('drawingData', drawingData => onReceiveDrawingData?.(drawingData))

    //receive id assignment from server
    socket.on('assign id', id => onReceiveIdAssignment?.(id))

    //incoming user data from server (user status connect or status update)
    socket.on('user', userData => onReceiveUserData?.(userData))

    //return disconnect function
    return () => {
        socket.off();
        socket.disconnect();
    }
}

