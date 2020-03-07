import fb from '../../Firebase/Firebase'

const onlineRef = fb.database().ref('.info/connected') // Get a reference to the list of connections

const connected = uid => {

    onlineRef.on('value', snapshot => {
      
      fb.database()
        .ref(`/status/${uid}`)
        .onDisconnect() // Set up the disconnect hook
        .set('offline') // The value to be set for this key when the client disconnects
        .then(() => {
            fb.database().ref(`/status/${uid}`).set('online')            
        })
      
    })
}

export default connected

/*
 
    let testReq = fb.functions().httpsCallable('testReq')

    testReq(post).then(result => {

        console.log('test req ',result.data)
    })
    
    let addMessage = fb.functions().httpsCallable('addMessage')

    addMessage(post).then(result => {

        console.log(result.data)
    })
            
*/