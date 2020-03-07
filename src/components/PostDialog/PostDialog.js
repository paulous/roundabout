import React, { PureComponent } from 'react'
import { createOrDeleteRoom } from '../../api'
import fb from '../../Firebase/Firebase'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
//import DialogTitle from '@material-ui/core/DialogTitle'
//import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
//import AddIcon from '@material-ui/icons/Add'
import { CloseIcon, FileOutlineIcon, PlusIcon } from 'mdi-react'
import Zoom from '@material-ui/core/Zoom'
import DraftEditor from '../Draft/DraftWysiwyg'

const Transition = props => <Slide direction="up" {...props} />

class postDialog extends PureComponent {

    state = {
        openDialog: false,
        openDialogExt: false,
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

    categories = [
        '0 is default',
        'All',
        'Services',
        'Swap',
        'Trade',
        'Free',
        'Exchange',
        'Social',
        'Question'
    ]

    openDialogExt = () => {
        this.setState({ openDialogExt: true })
        this.dialogEnter()
    }

    dialogEnter = event => {

        const { postToEdit, openDialogExt  } = this.props

        if ( openDialogExt !== undefined )
            this.setState(
                {
                    selectedCat: postToEdit.selectedCat,
                    subject: postToEdit.subject,
                    body: postToEdit.body
                }
            )
    }

    categoryChange = event => {
        this.setState({ selectedCat: event.target.value })
    }

    subjectChange = event => {

        event.target.value.length > 35
            ? this.props.openSnack('warning', `Try to keep it breif. It's just better for everyone.`)
            : this.setState({ subject: event.target.value })
    }

    bodyChange = event => {

        event.target.value.length > 350
            ? this.props.openSnack('warning', `Maximum of 350 chars reached.`)
            : this.setState({ body: event.target.value })
    }

    setError = err => {
        this.props.openSnack('warning', 'Make sure all fields are filled in before you add post.')
        this.setState(prev => ({
            errorDialog: {
                ...prev.errorDialog,
                ...err
            }
        }))
    }

    submitPost = post => {

        const { user, openSnack } = this.props

        let posts = fb.firestore().doc( `posts/${ post.key }` )
        let usr = fb.firestore().doc(`users/${user.uid}/posts/${post.key}`)

        usr.set( post ).then( () => {            

            post.live 
                ?   posts.set( post ).then( () => {

                        openSnack('success', `${user.name}. Your post is live. Edit in dashboard.`)
                    })
                    .catch(error => openSnack('error', error.message))

                :   openSnack('info', `${user.name}. Your post is NOT live. Edit in dashboard.`)
        })
        .catch(error => openSnack('error',error.message))
    }

    submitBtn = live => event => {

        const { selectedCat, subject, body } = this.state
        const { user } = this.props

        if (selectedCat && subject && body) {

            let key = fb.firestore().collection('posts').doc().id
            let timestamp = new Date()
            let created = timestamp.toLocaleString()

            let post = {
                key,
                live,
                queries: { 
                    all: 'all', 
                    lev_0:user.location.lev_0, 
                    lev_1:user.location.lev_1, 
                    lev_2:user.location.lev_2 
                },
                selectedCat,
                category: this.categories[selectedCat],
                subject,
                body,
                user:
                {
                    uid: user.uid,
                    sockId: user.sockId,
                    name: user.name,
                    email: user.email,
                    visits: user.visits,
                    location:user.location
                },
                timestamp,
                created
            }

            createOrDeleteRoom({ action:'add', key })

            this.submitPost( post, key )

            this.setState({ selectedCat: 0, subject: '', body: '', openDialog: false })

        } else {
            !selectedCat && this.setError({ category: true })
            !subject && this.setError({ subject: true })
            !body && this.setError({ body: true })
        }
    }

    deleteBtn = (user, post) => event => {

        this.props.closeDialogExt()

        fb
            .firestore()
            .doc(`posts/${post.key}`)
            .delete().then(() => {
                this.props.openSnack('success', `Your post: ${post.subject} Has been deleted.`)
            })
        fb
            .firestore()
            .doc( `users/${user.uid}/posts/${post.key}` )
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

        this.setState(state => ({ openDialog: !state.openDialog }))
    }

    editPost = () => {

        const { selectedCat, subject, body } = this.state
        const { user, openSnack, postToEdit, closeDialogExt } = this.props

        let editedPost =
        {
            selectedCat,
            category: this.categories[selectedCat],
            subject,
            body,
            location: user.location
        }

        if (
            selectedCat === postToEdit.selectedCat &&
            subject === postToEdit.subject &&
            body === postToEdit.body
        ) {
            openSnack( 'warning', `Nothing has changed. Make some edits and 'Save Post'`)
            return
        }

        closeDialogExt()

        let posts = fb.firestore().doc( `posts/${postToEdit.key}` )
        let userPosts = fb.firestore().doc(`users/${user.uid}/posts/${postToEdit.key}`)

        userPosts.update(editedPost).then(() => {

            if ( postToEdit.live ) {

                posts.update(editedPost).then(() => {

                    openSnack( 'success', `${user.name}. Your post has been saved and is live.`)

                })
                .catch(error => openSnack('error', error.message))
            }
            else {
                openSnack( 'info', `${user.name}. Your post has been saved but is not live.`)
            }

        })
        .catch(error => openSnack( 'error', error.message))

        this.setState({ selectedCat: 0, subject: '', body: '' })
    }

    getDraft = raw => this.setState({ body:raw})

    render() {

        const { selectedCat, errorDialog, openDialog } = this.state
        const { user, openDialogExt, closeDialogExt, postToEdit, brakepointSM } = this.props

        const externalOpen = openDialogExt === undefined ? false : true

        return (
            <React.Fragment>
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
                                style={{ position: 'fixed', bottom: '5%', right: '5%' }}
                                color="primary"
                                variant="fab"
                                onClick={this.openBtn}
                            >
                                <PlusIcon />
                            </Button>
                            :
                            <noscript />
                    }
                </Zoom>
                <Dialog
                    //disablePortal={true}                        
                    open={externalOpen ? openDialogExt : openDialog}
                    onEnter={externalOpen ? this.dialogEnter : null}
                    onClose={externalOpen ? closeDialogExt : this.closeBtn}
                    TransitionComponent={Transition}
                    fullScreen={!brakepointSM}
                >
                    <DialogActions>
                        <Typography 
                            style={{display:'flex', alignItems:'center', flexGrow:'1', paddingLeft:'24px'}} 
                            component="h2" 
                            variant="headline" 
                            noWrap
                        >
                            <FileOutlineIcon /> {externalOpen ? 'Edit' : 'Create'} 
                        </Typography >
                        {
                            externalOpen
                                ?   <React.Fragment>
                                        <Button size="large" onClick={this.editPost} color="primary">
                                            SAVE
                                        </Button>
                                        <Button size="large" onClick={this.deleteBtn(user, postToEdit)} color="primary">
                                            DELETE
                                        </Button>
                                    </React.Fragment>
                                :   <React.Fragment>
                                        <Button size="large" onClick={this.submitBtn(true)} color="primary">
                                            GO LIVE
                                        </Button>
                                        <Button size="large" onClick={this.submitBtn(false)} color="primary">
                                            SAVE
                                        </Button>
                                    </React.Fragment>
                        }
                        { !brakepointSM && <Button onClick={ externalOpen ? closeDialogExt : this.closeBtn} ><CloseIcon size={36} /></Button> }
                    </DialogActions>
                    <Divider light />                    
                    <div style={
                        {
                            display:'flex', 
                            flexDirection:'column', 
                            padding:'24px',
                            minHeight:'150px',
                            background:'#f3f9f9'
                        }}>
                        <FormControl
                            style={{marginBottom: '10px'}}>
                            <NativeSelect
                                autoFocus
                                error={errorDialog.category}
                                defaultValue={externalOpen ? postToEdit.selectedCat : selectedCat}
                                onChange={this.categoryChange}
                                required>
                                <option value={0} disabled>
                                    What best describes your post?
                                </option>
                                {
                                    this.categories.map((cat, i) => i !== 0 && <option key={i.toString()} value={i}>{cat}</option>)
                                }
                            </NativeSelect>
                        </FormControl>
                        <TextField
                            style={{
                                marginBottom:'5px'
                            }}
                            onChange={this.subjectChange}
                            error={errorDialog.subject}
                            label='Subject...'
                            defaultValue={externalOpen ? postToEdit.subject : ''}
                            type="text"
                            maxLength="60"
                            fullWidth={brakepointSM}
                        />
                    </div>
                    <Divider light />
                    <DialogContent style={{minHeight:'300px'}}>

                        <DraftEditor getDraft={this.getDraft} {...this.props} />

                    </DialogContent>                   
                </Dialog>
            </React.Fragment>
        )
    }
}

export default postDialog