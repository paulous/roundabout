import React, {Component} from 'react'
import fb from '../../Firebase/Firebase'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import AddIcon from '@material-ui/icons/Add'
import Zoom from '@material-ui/core/Zoom'
import Aux from '../Aux/Aux'


const Transition = props => <Slide direction="up" {...props} />

class postDialog extends Component {

    state = {
        openDialog: false,
        closeDialog: false,
        selectedCat: 0,
        subject: '',
        body: '',
        errorDialog: {
            category: false,
            subject: false,
            body: false
        }
    }

    dialogEnter = event => {

        const { openDialogExt, postToEdit } = this.props

        if( openDialogExt !== undefined )
        this.setState(
            {
                selectedCat: postToEdit.selectedCat, 
                subject: postToEdit.subject, 
                body: postToEdit.body
            }
        )
    }

    categoryChange = event => {
        this.setState({selectedCat: event.target.value})
    }

    subjectChange = event => {
        this.setState({subject: event.target.value})
    }

    bodyChange = event => {
        this.setState({body: event.target.value})
    }

    setError = err => {
        this.setState( prev => ({
            errorDialog: {
                ...prev.errorDialog,
                ...err
            }
        }))
    }

    submitPost = post => {
        
        const { user } = this.props

        let posts = fb.firestore().collection('posts').doc()
        let usr = fb.firestore().collection('users').doc(user.uid).collection('posts').doc(posts.id)
        
        posts.set( post ).then( () => {
            usr.set( post ).then( () => {

                console.log('Post has been submited, added to user and userPosts ')

            }).catch( error => console.log(error.code, error.message))
        }).catch( error => console.log(error.code, error.message))
    }

    submitBtn = event => {

        const { selectedCat, subject, body } = this.state
        const { user, openDialogExt, postToEdit } = this.props

        if( openDialogExt !== undefined ){

            this.editPost()
        }
        else if ( selectedCat && subject && body ) {

            let key = fb.firestore().collection('posts').doc().id      

            let post = {
                queries:{all:'all'},
                selectedCat, 
                subject, 
                body, 
                user:
                { 
                    uid:user.uid,
                    name: user.name, 
                    visits: user.visits
                },
                timestamp: fb.firestore.FieldValue.serverTimestamp()
            }

            this.submitPost(post, key) 
            this.setState({selectedCat: 0, subject: '', body: '', openDialog: false})

        } else {
            !selectedCat && this.setError({category: true})
            !subject && this.setError({subject: true})
            !body && this.setError({body: true})
        }
    }

    deleteBtn = (uid , key) => event => {

        fb
            .firestore()
            .collection('posts')
            .doc(key)
            .delete()
        fb
            .firestore()
            .collection('users')
            .doc(uid).collection('posts').doc(key)
            .delete()
    }

    closeBtn = event => {
        let open = this.state.openDialog
        this.setState({
            openDialog: !open,
            selectedCat: 0,
            subject: '',
            body: '',
            errorDialog: {
                category: false,
                subject: false,
                body: false
            }
        })
    }

    openBtn = evet => {

        this.setState( state => ({openDialog: !state.openDialog}))
    }

    editPost =  () => {

        const { selectedCat, subject, body } = this.state
        const { user, postToEdit, closeDialogExt } = this.props

        let editedPost = 
        { 
            selectedCat, 
            subject,
            body 
        }

        if( 
            selectedCat === postToEdit.selectedCat && 
            subject === postToEdit.subject && 
            body === postToEdit.body 
        ) return

        closeDialogExt()

        let posts = fb.firestore().collection('posts').doc( postToEdit.key )
        let userPosts = fb.firestore().collection('users').doc( user.uid ).collection( 'posts' ).doc( postToEdit.key )
        
        posts.update( editedPost ).then( () => {
            userPosts.update( editedPost ).then( () => {

                console.log('Post has been edited and also added to user posts.. ')
                this.setState({selectedCat: 0, subject: '', body: ''})


            }).catch( error => console.log(error.code, error.message))
        }).catch( error => console.log(error.code, error.message))
    }

    render() {

        const { selectedCat, errorDialog, openDialog } = this.state
        const { user, openDialogExt, closeDialogExt, postToEdit } = this.props

        const externalOpen = openDialogExt === undefined ? false : true

        return (
            <Aux>
                { this.props.children }
                <Zoom
                    in={true}
                    timeout={{
                    enter: 300,
                    exit: 300
                }}
                unmountOnExit>
                    { 
                        !externalOpen
                        ?
                            <Button 
                                style={{position: 'fixed', bottom: '5%', right: '5%'}} 
                                color="primary" 
                                variant="fab" 
                                onClick={this.openBtn}
                                >
                                <AddIcon/>
                            </Button> 
                        : 
                            <noscript/>
                    }
                </Zoom>
                <Dialog
                    open={ externalOpen ? openDialogExt : openDialog}
                    onEnter={ externalOpen ? this.dialogEnter : null }
                    onClose={ this.closeBtn }
                    aria-labelledby="form-dialog-title"
                    TransitionComponent={Transition}
                    >
                    <DialogTitle id="form-dialog-title">{user.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Hi {user.name}. There maybe people close by that could benifit from what you have to share.
                        </DialogContentText>
                        <FormControl
                            style={{
                            marginBottom: '10px',
                            marginTop: '10px'
                        }}>
                            <NativeSelect
                                autoFocus={true}
                                error={errorDialog.category}
                                //value={selectedCat}
                                defaultValue={externalOpen ? postToEdit.selectedCat : selectedCat }
                                onChange={this.categoryChange}
                                required={true}>
                                <option value={0} disabled>
                                    Choose a category!
                                </option>
                                <option value={1}>All</option>
                                <option value={2}>Services</option>
                                <option value={3}>Trade</option>
                                <option value={4}>For Free</option>
                                <option value={5}>Exchange</option>
                                <option value={6}>Social</option>
                            </NativeSelect>
                            <FormHelperText>Help people find you.</FormHelperText>
                        </FormControl>
                        <TextField
                            style={{
                            marginBottom: '10px'
                        }}
                            onChange={this.subjectChange}
                            error={errorDialog.subject}
                            label='Subject'
                            defaultValue={ externalOpen ? postToEdit.subject : '' }
                            type="text"
                            fullWidth
                            />
                        <TextField
                            onChange={this.bodyChange}
                            error={errorDialog.body}
                            multiline={true}
                            rows="8"
                            label='Write post here' 
                            defaultValue={externalOpen ? postToEdit.body : ''}
                            type="text"
                            fullWidth
                            />
                    </DialogContent>
                    <DialogActions>
                        {
                            externalOpen 
                            ? <Aux>
                                <Button onClick={this.submitBtn} color="primary">
                                    Update Post
                                </Button>
                                <Button onClick={closeDialogExt} color="primary">
                                Close
                                </Button>
                                <Button onClick={this.deleteBtn( user.uid, postToEdit.key )} color="primary">
                                    Delete Post
                                </Button>
                            </Aux>
                            : <Aux>
                                <Button onClick={this.submitBtn} color="primary">
                                    Add Post
                                </Button>
                                <Button onClick={this.closeBtn} color="primary">
                                    Close
                                </Button>
                            </Aux>
                        }
                    </DialogActions>
                </Dialog>
        </Aux>
        )
    }
}

export default postDialog