/**
 *  global socket.io stuff
 * 
 * 
 */
import { store, dispatch } from './redux/store';
import {io} from 'socket.io-client';
import { 
    removeOtherUsersAll,
    setOwnConnected,
 } from './redux/user/userSlice';

// const SERVER_URL = 
//     process.env.NODE_ENV === 'production'?
//         'https://doodle-thing.herokuapp.com/' :
//         'http://localhost:8080'



//socket instance
let socket = null

//send drawing data to server
export const sendDrawingData = (data) => socket?.emit('drawingData', data);

//send user data to server
export const sendUserData = (data) => {
    socket?.emit('user', data)
};


const subscribers = new Map();

function getListeners(event){
    return subscribers.get(event) ?? null;
}

function addListener(event, listener, oneOff = false){
    const eventListeners = getListeners(event) ?? new Map();
    const key = Symbol(`key for ${oneOff ? 'one-off ' : ''}${event} listener: ${listener.name || 'anonymous function'}`);
    eventListeners.set(key, {listener, oneOff});
    subscribers.set(event, eventListeners);
    return key;
}

/**
 * subscribe to a socket event
 * @param {string} event 
 * @param {function} listener 
 * @param {boolean} oneOff if true, remove the listener automatically after invoking it; defaults to false
 * @returns {()=>void} a function to manually unsubscribe from the event
 */
export function subscribe(event, listener, oneOff=false){
    const key = addListener(event, listener, oneOff);
    return () => unsubscribe(event, key);
}

function unsubscribe(event, key){
    return !!subscribers.get(event)?.delete(key);
}

//establish socket connection & set up socket events
export function connectToServer(){

    if(socket?.connected) return console.log('already connected to server');
    
    socket = io(process.env.REACT_APP_SERVER_URL, {transports: ['websocket', 'polling']})            


    //catch all subscription listener for incoming events
    socket.onAny((event, ...args) => {

        //subscribers for this event
        const eventSubscribers = subscribers.get(event);

        eventSubscribers?.forEach(({listener, oneOff}, key) => {
            
            //invoke the listener
            listener(...args);

            //unsubscribe if it's a one-off
            if(oneOff){
                eventSubscribers.delete(key);
            }
        })
    })
    
    socket.on('confirmation', () => {
        console.log(`connected to server at ${process.env.REACT_APP_SERVER_URL}`)
        console.log(`socket id: ${socket.id}`)
    })

    socket.on('disconnect', () => {
        dispatch(setOwnConnected(false));
        dispatch(removeOtherUsersAll());
    })


    //FIXME - request canvas timestamp/data on reconnect - see fixme in canvas.jsx
    socket.on('connect', () => {
        console.log('connect')

        dispatch(setOwnConnected(true));

        const state = store.getState()
        const {id, status, name} = state.user;
        const {color} = state.drawingSettings;

        if(id){
            socket.emit('user', {name, id, status, color});
        }        

    })

    //return disconnect function
    return () => {
        socket.off();
        socket.disconnect();
    }
}

