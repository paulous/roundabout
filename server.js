
const io = require('socket.io')()

const rooms = {} // all chat messages in all rooms

io.on('connection', client => {

    const enterRoom = data => {
        // Joined, to everyone
        //io.in(data.post.key).emit('introMessage', data)
        io.in( data.key ).emit('snack message', `${data.guest} has joined ${data.host}'s post.`)


        if ( rooms.hasOwnProperty( data.key ) ) {//does room exist

            if ( rooms[ data.key ].length ) {//dose it have messages
                // Messages, just to you
                client.emit('room messages', rooms[ data.key ])
            }
        }
    }

    // Join one of your rooms
    client.on('join your room', data => { enterRoom( data ) })

    // Join someone elses room
    client.on('join room', data => {
        client.join( data.key, () => {
            
            enterRoom( data )
            //console.log('Join room', Object.keys(client.rooms))
        }, 
        err => console.log(err) )
    })

    client.on('create room', key => {
        client.join( key, err => console.log(err) )
    })

    client.on('new message', data => {
        //save messages
        rooms.hasOwnProperty( data.key )
            ? rooms[ data.key ].push( data )
            : rooms[ data.key ] = [ data ]
        // Send to everyone in room exept you
        client.to(data.key).emit('incoming message', data)
        console.log('message sent');
    })

    //Is the user typing
    client.on('is typing', data => {
        client.to(data.key).emit('typing', data.is)
    })

    //Leave if it's not your room
    client.on('leave room', data => {
        io.in( data.key ).emit('snack message', `${data.guest} has left ${data.host}'s post.`)
        client.leave( data.key )
    })

    client.on('prompt user', sockId => {
        client.to( sockId ).emit( 'prompt', 'I just sent you a message' )

    })

    //Delete a chosen rooms messages
    client.on('delete room messages', key => {

        if ( rooms.hasOwnProperty( key ) ) {
            delete rooms[key]
            console.log('Delete room', key, rooms)
        }
    })

    // Not used so far
    client.on('connect_timeout', (timeout) => {
        console.log('timeout...', timeout);
    })

    client.on('disconnecting', (reason) => {
        //delete rooms
        console.log('disconnecting...', reason);
    })

    client.on('disconnect', (reason) => {

        client.disconnect( true )
        console.log('disconnect...', reason);
    })
})

const port = 8000;
io.listen(port);
console.log('listening on port ', port)