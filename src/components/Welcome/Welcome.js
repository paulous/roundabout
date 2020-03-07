import React, {PureComponent} from 'react'
import fb from '../../Firebase/Firebase'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
//import Visibility from '@material-ui/icons/Visibility'
//import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { EyeIcon, EyeOffIcon } from 'mdi-react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import {Collapse} from '@material-ui/core'
import onDisconnect from './onDisconnect'
import { getUserLocation, osmData } from '../UserLatLon/userLatLon'

class welcome extends PureComponent {

    state = {
        name: '',
        showNameField: false,
        email: '',
        password: '',
        showPassword: false,
        error: {
            name: false,
            email: false,
            password: false
        },
        hasLocation:false,
        lat:'',
        lon:''
    }

    componentDidMount = () => {
        getUserLocation( (lat, lon) => this.setState({ hasLocation:true, lat, lon }))
    } 

    logIn = ( email, pass, location ) => {

        const {access, openSnack} = this.props

        fb
            .auth()
            .signInWithEmailAndPassword(email, pass)
            .then(data => {
                
                let {uid} = data.user

                fb
                    .firestore()
                    .collection('users')
                    .doc(uid)
                    .get()
                    .then(doc => {

                        if (doc.exists) {
                            let usr = doc.data()
                            usr.visits = usr.visits + 1
                            usr.location = location

                            fb
                                .firestore()
                                .collection('users')
                                .doc(uid)
                                .update(
                                    {
                                        visits:usr.visits, 
                                        online:true, 
                                        location
                                    })
                                .then( () => {
                                    console.log('logIn', location)

                                    onDisconnect( uid ) // user connected true
                                    access(usr)

                                })
                                .catch(error => openSnack('error', error.message))
                        } else {
                            openSnack('error', 'Something went wrong. Try again.')
                        }
                    })
                    .catch(error => openSnack('error', error.message))
            })
            .catch(error => {
                this.setError({email: true, password: true})
                this.setState(prev => ({
                    error: {
                        ...prev.error,
                        name: true
                    }
                }))
                openSnack('error', error.message)
            })
    }

    signUp = (email, pass, name, location) => {

        const {access, openSnack} = this.props

        fb
            .auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(user => {
                
                let { uid, email } = user.user
                //SET USER note:Not using users fb uid
                let setUser = fb.firestore().collection('users')
                
                let newUid = setUser.doc().id

                    setUser.doc( uid ).set({
                        uid:newUid,
                        email,
                        name,
                        pass,
                        visits: 0,
                        online:true,
                        location
                    })
                    .then( () => {                        
                        //SET TABS
                        fb
                            .firestore()
                            .collection('tabs')
                            .doc( uid )
                            .set({
                                todo:'still have to create.'
                            })
                            .then(() => {

                                onDisconnect( uid ) // user connected true
                                access({ uid:newUid, email, name, visits: 0, location })
                            })
                            .catch(error => openSnack('error', error.message))
                    })
                    .catch(error => openSnack('error', error.message))
            })
            .catch(error => {
                this.setError({email: true, password: true})
                openSnack('error', error.message)
            })
    }

    loginSignup = (login, location) => {

        const {email, password, name, error} = this.state

        if (login && email && password) {
            this.logIn(email, password, location)
        } 
        else if (!login && email && password && name) {
            this.signUp(email, password, name, location)
        } 
        else {
            !error.name && this.setError({name: true})
            !error.email && this.setError({email: true})
            !error.password && this.setError({password: true})
            
            this.props.openSnack('error', 'Make sure all fields are filled in.')
        }
    }

    nameChange = event => {
        this.setState({name: event.target.value})
        this.state.error.name && this.setError({name: false})
    }

    emailChange = event => {
        this.setState({email: event.target.value})
        this.state.error.email && this.setError({email: false})
    }

    passwordChange = event => {
        this.setState({password: event.target.value})
        this.state.error.password && this.setError({password: false})
    }

    setError = err => {
        this.setState(prev => ({
            error: {
                ...prev.error,
                ...err
            }
        }))
    }

    handleMouseDownPassword = event => {
        event.preventDefault()
    }

    showPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    render() {

        const {error, showNameField, hasLocation, lat, lon} = this.state

        return (
            <React.Fragment>
                <Card
                    style={{
                    maxWidth: '400px',
                    margin: '30px'
                }}>
                    <CardContent
                        style={{
                        padding: '25px'
                    }}>
                        <Typography variant="headline">
                            Roundabout
                        </Typography>
                        <Typography color="textSecondary">
                            Share stuff.
                        </Typography>
                        <Typography variant="subheading">
                            Roundabout want's you to share all that stuff you have
                            squiriled away. Promote your service. Swap stuff. Basicaly
                            anything you can do localy. Find out if anyone in your area
                            has posted something. If not try posting something yourself
                            and make some Bitcoin for you effort.
                        </Typography>
                        <Collapse direction="up" in={showNameField} mountOnEnter unmountOnExit>
                            <TextField
                                autoFocus={true}
                                style={{
                                marginBottom: '10px'
                            }}
                                onChange={this.nameChange}
                                maxLength="30"
                                error={error.name}
                                label="Name"
                                type="text"
                                fullWidth/>
                        </Collapse>
                        <TextField
                            autoFocus={true}
                            style={{
                            marginBottom: '10px'
                        }}
                            onChange={this.emailChange}
                            maxLength="30"
                            error={error.email}
                            label="Email"
                            type="text"
                            fullWidth/>
                        <FormControl fullWidth label="Password" error={error.password}>
                            <InputLabel htmlFor="adornment-password">Password</InputLabel>
                            <Input
                                type={this.state.showPassword
                                ? 'text'
                                : 'password'}
                                onChange={this.passwordChange}
                                maxLength="30"
                                endAdornment={< InputAdornment position = "end" > <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.showPassword}
                                onMouseDown={this.handleMouseDownPassword}>
                                {this.state.showPassword
                                    ? <EyeOffIcon/>
                                    : <EyeIcon/>}
                            </IconButton> </InputAdornment>}/>
                        </FormControl>
                    </CardContent>
                    <CardActions>
                        {
                            showNameField
                            ?   <Button 
                                disabled={!hasLocation} 
                                onClick={ e => this.setState({showNameField: !showNameField})}
                                color="secondary">
                                    LOG IN
                                </Button>
                            :   <Button disabled={!hasLocation} onClick={e => this.setState({showNameField: !showNameField})}
                                    color="secondary">
                                    NEWUSER
                                </Button>
                        }
                        <Button disabled={!hasLocation} onClick={ () => { osmData( lat, lon, data => {
                            

                            if( data.constructor === Object ){

                                this.loginSignup(!showNameField, data)
                                this.props.openSnack( 'info', `Your location is:  ${data.display_name}` )
                            }
                            else{
                                this.props.openSnack( 'error', data )
                            }
                        })}}
                        color="primary">
                            ENTER
                        </Button>
                    </CardActions>
                </Card>
            </React.Fragment>
        )
    }
}

export default welcome