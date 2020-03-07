const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore();

exports.onUserStatusChanged = functions
    .database
    .ref('/status/{uid}')
    .onUpdate(event => {

        const usersRef = firestore.doc(`/users/${event.params.uid}`)

        return event
            .data
            .ref
            .once('value')
            .then(statusSnapshot => snapShot.val()) // Get the latest value from the Firebase Realtime database
            .then(status => {
                // check if the value is 'offline'
                if (status === 'offline') {

                    usersRef.set({
                        online: false
                    }, {merge: true})

                    usersRef
                        .getCollections()
                        .then(collections => {

                            collections.forEach(collection => {

                                if (collection.id === 'activePosts') {

                                    firestore
                                        .doc(collection.id)
                                        .get()
                                        .then(doc => {

                                            doc
                                                .data()
                                                .forEach(key => {

                                                    firestore.doc(`/posts/${ [key]}`).delete()
                                                })
                                        })
                                }
                            })
                        })

                }
            })
    })