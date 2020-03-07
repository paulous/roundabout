import fb from './Firebase'

export const reAuth = () => {

    let user = fb.auth().currentUser, credential

    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
        // User re-authenticated.
      }).catch(function(error) {
        // An error happened.
      })
}

export const deleteUser = cb => {

    let user = fb.auth().currentUser

    user.delete()
        .then( () => {
            cb(`${user.displayName}. Your account has been DELETED.`)
        }).catch( error => {
            cb(`${user.displayName}. An Error occured. Please try again.`)
        })
}

export const sendPassResetEmail = emailAddress => {

    let auth = fb.auth()
    //var emailAddress = "user@example.com";

    auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    })
}

export const changePassword = newPassword => {

    let user = fb.auth().currentUser
    //var newPassword = getASecureRandomPassword();

    user.updatePassword(newPassword).then(function() {
    // Update successful.
    }).catch(function(error) {
    // An error happened.
    })
}

export const verificationEmail = () => {

    let user = fb.auth().currentUser
    //set up email template in Auth section of console
    user.sendEmailVerification().then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    })
}

export const updateEmailAddress = emailAddress => {

    let user = fb.auth().currentUser;

    user.updateEmail("user@example.com").then(function() {
    // Update successful.
    }).catch(function(error) {
    // An error happened.
    })
}

export const getProfile = profile => {

    let user = fb.auth().currentUser;
    let name, email, photoUrl, uid, emailVerified;

    if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
    }
}

export const updateProfile = profile => {

    let user = fb.auth().currentUser;

        user.updateProfile({
        displayName: "Jane Q. User",
        photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function() {
        // Update successful.
        }).catch(function(error) {
        // An error happened.
        })
}

export const onAuthStateChange = cb => {

    fb.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log('User is signed IN Auth Changed',user)
          cb(user)
        } else {
            console.log('User is signed OUT Auth Changed',user)
        }
      })
}

/* Was in PanelItems to change post auth state
        fb.auth().onAuthStateChanged( userState => {

            userState
            ?   this.setState( state => {

                    let someUserLoggedIn = state.fsData.map( post => {

                        if( post.user.uid === userState.uid ){
                            post.authStateChange = true
                        }
                    })                            
                    return { fsData: someUserLoggedIn }
                })
			:   this.props.openSnack(`${user.name} has logged out.`)
		  })
*/