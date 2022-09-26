import {io} from 'socket.io-client';

// const SERVER_URL = 
//     process.env.NODE_ENV === 'production'?
//         'https://doodle-thing.herokuapp.com/' :
//         'http://localhost:8080'

export let socket

export const pointerStateHandlers = []
export const dataRequestHandlers = []

export function connectToServer(){

    if(socket?.connected){
        console.log('already connected to server')
        return
    }
    
    socket = io(process.env.REACT_APP_SERVER_URL, {transports: ['websocket', 'polling', 'flashsocket']})            

    socket.on('confirmation', () => {
        console.log(`connected to server at ${process.env.REACT_APP_SERVER_URL}`)
        console.log(`socket id: ${socket.id}`)
    })

    //incoming drawing data from server (other clients drawing)
    socket.on('pointerState', pointerState => {
        for(const fn of pointerStateHandlers){
            fn?.(pointerState)
        }
    })

    //server request canvas image state
    socket.on('request canvas data', () => {
        for(const fn of dataRequestHandlers){
            fn?.()
        }
    })

    function disconnect(){
        socket.off('confirmation')
        socket.off('pointerState')
        socket.off('request canvas data')

        socket.disconnect()
    }

    return disconnect
}

