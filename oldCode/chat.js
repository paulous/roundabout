
exports.socket = (io) => {

	const rooms = {} // all chat messages in all rooms

	io.on('connection', sock => {

		const join = data => {
			// Joined, to everyone
			io.in(data.post.key).emit('message', data)

			if (rooms.hasOwnProperty(data.post.key)) {//dose room exist
				if (rooms[data.post.key].length) {//dose it have messages
					// Messages, just to you
					sock.emit('getMessages', rooms[data.post.key])
				}
			}
		}

		// Join one of your rooms
		sock.on('join postroom', data => { join(data) })

		// Join someone elses room
		sock.on('join room', data => {
			sock.join(data.post.key, () => {

				if (!data.evBus) {
					join(data)
				}
			})
		})

		//Leave if it's not your room
		sock.on('leave room', data => {

			io.in(data.post.key).emit('leftRoom', data)
			sock.leave(data.post.key, () => {
				console.log('leave room', data.post.key)

			})
		})

		// Send messages to room that you joined
		sock.on('message', data => {
			//save messages
			if (rooms.hasOwnProperty(data.post.key)) {
				rooms[data.post.key].push(data)
			}
			else {
				rooms[data.post.key] = [data]
			}
			// Send to everyone in room exept you
			sock.to(data.post.key).emit('message', data)
			console.log('message sent');
		})

		//Delete a chosen rooms messages
		sock.on('delete room', room => {
			if (rooms.hasOwnProperty(room)) {
				delete rooms[room]
			}
		})

		sock.on('disconnecting', (reason) => {
			//delete rooms
			console.log('disconnecting...');
		})

		sock.on('disconnect', (reason) => {
			console.log('disconnect...');
		})
	})
}
