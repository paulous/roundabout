import openSocket from 'socket.io-client'

//const socket = openSocket('http://localhost:3030')
const socket = openSocket('https://now-ygxjicwvcm.now.sh')

let isTypingTimeout = setTimeout

export const sockId = () => ( new Promise( resolve => { resolve(socket.id) } ))


export const createOrDeleteRoom = ({ action, key }) => {//TODO send more than one at a time.

    action === 'add'
    ? socket.emit( 'create room', key )        
    : socket.emit( 'delete room messages', key )        
}

export const messageListen = cb => {
    socket.on('incoming message', incoming => cb( null, incoming ) )
}

export const newMessage = message => {
    socket.emit('new message', message)
}

export const typing = cb => {
    socket.on('typing', incoming => cb( incoming ) )
}

export const isTyping = key => {
    socket.emit('is typing', {key, is:true})

    clearTimeout( isTypingTimeout )

    isTypingTimeout = setTimeout( () => {
        socket.emit('is typing', {key, is:false})
    }, 2000)
}

export const joinRoom = (data, cb) => {
    socket.once('room messages', incoming => cb( null, incoming ) )
    socket.emit('join room', data)
}

export const joinYourRoom = (data, cb) => {
    socket.once('room messages', incoming => cb( null, incoming ) )
    socket.emit('join your room', data)
}

export const leaveRoom = data => {
    socket.emit('leave room', data)
}

export const deleteRoomMessages = key => {
    socket.emit('delete room messages', key)
}

export const promptUser = sockId => {
    socket.emit('prompt user', sockId)
}

export const promptCallback = cb => {
    socket.on('prompt', prompt => cb( null, prompt ) )
}

export const snackMessage = cb => {
    socket.on('snack message', message => cb( null, message ) )
}
