import {io} from 'socket.io-client';

const SERVER_URL = 
    process.env.NODE_ENV === 'production'?
        'https://doodle-thing.herokuapp.com/' :
        'http://localhost:8080'

export let socket

export const pointerStateHandlers = []

export function connectToServer(){

    if(socket?.connected){
        console.log('already connected to server')
        return
    }
    
    socket = io(SERVER_URL, {transports: ['websocket', 'polling', 'flashsocket']})            

    socket.on('confirmation', () => {
        console.log(`connected to server at ${SERVER_URL}`)
    })

    socket.on('pointerState', pointerState => {

        for(const fn of pointerStateHandlers){
            fn?.(pointerState)
        }
    })

    

    return socket
}

