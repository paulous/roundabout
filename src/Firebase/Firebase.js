// Firebase App is always required and must be first const firebase =
// require("firebase/app") require("firebase/firestore")

import firebase from '@firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
// Add additional services you want to use

const config = {
    apiKey: "AIzaSyCuvGOFuRpdeSv7Q0C00K5vGWw-6YQMWHI",
    authDomain: "roundabout-49872.firebaseapp.com",
    databaseURL: "https://roundabout-49872.firebaseio.com",
    projectId: "roundabout-49872",
    storageBucket: "roundabout-49872.appspot.com",
    messagingSenderId: "540845706794"
}

firebase.initializeApp(config)

const firestore = firebase.firestore()
const settings = {/* your settings... */
    timestampsInSnapshots: true
}
firestore.settings(settings)

export default firebase