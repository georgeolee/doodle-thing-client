import {io, Socket} from 'socket.io-client';

let serverUrl

if(process.env.NODE_ENV !== 'production'){
    serverUrl = 'https://doodle-thing.herokuapp.com/'
}else{
    serverUrl = 'http://localhost:8080'
}


export let socket

export const pointerStateHandlers = []

export function connectToServer(){

    if(socket?.connected){
        console.log('already connected to server')
        return
    }
    
    socket = io(serverUrl)            

    socket.on('confirmation', () => {
        console.log(`connected to server at ${serverUrl}`)
    })

    socket.on('pointerState', pointerState => {

        for(const fn of pointerStateHandlers){
            fn?.(pointerState)
        }
    })

    

    return socket
}

