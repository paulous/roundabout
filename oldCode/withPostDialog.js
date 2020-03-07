import React from 'react'
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
import styler from '../../components/Styler/Styler'
import Aux from '../Aux/Aux'


const Transition = props => <Slide direction="up" {...props} />

const withPostDialog = Wrapper => {

    return class dialog extends Wrapper {


        categoryChange = event => {
            this.setState({selectedCat: event.target.value})
            if (this.state.errorDialog.category) 
                this.seterrorDialog({category: false})
        }

        subjectChange = event => {
            this.setState({subject: event.target.value})
            if (this.state.errorDialog.subject) 
                this.seterrorDialog({subject: false})
        }

        bodyChange = event => {
            this.setState({body: event.target.value})
            if (this.state.errorDialog.body) 
                this.seterrorDialog({body: false})
        }

        setError = err => {
            this.setState( prev => ({
                errorDialog: {
                    ...prev.errorDialog,
                    ...err
                }
            }))
        }

        submitPost = (post) => {
            
            const {selectedCat, subject, body} = this.state
            const { user } = this.props

            let doc = fb.firestore().collection('posts').doc(),
            id = doc.id
            
            doc.set( post ).then( () => {

                fb.firestore()
                .collection('users')
                .doc(user.uid)
                .set({'posts':{[id]:{selectedCat, subject, body}}}, { merge: true })
                .then( () => {

                    console.log('Post has been submited and post added to user posts.. ')
                })
                .catch( error => console.log(error.code, error.message))
            })
            .catch( error => console.log(error.code, error.message))
        }

        submitBtn = event => {

            const {selectedCat, subject, body, user, close} = this.state

            let post = {} 
            let key = fb.firestore().collection('posts').doc().id      

            post = {
                queries:{all:'all'},
                selectedCat, 
                subject, 
                body, 
                user,
                timestamp: fb.firestore.FieldValue.serverTimestamp()
            }

            if (selectedCat && subject && body) {
                this.submitPost(post, key)
                close()
                this.setState({selectedCat: 0, subject: '', body: ''})

            } else {
                !selectedCat && this.setError({category: true})
                !subject && this.setError({subject: true})
                !body && this.setError({body: true})
            }
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

        render() {

            const { selectedCat, errorDialog, openDialog } = this.state
            const { user } = this.props

            const StylerBtnPost = styler(Button)(theme => ({
                position: 'fixed', bottom: '5%', right: '5%',
                //background:'green', color:'white', '&:hover':{ background:'red' }
            }))

            return (
                <Aux>
                    <Zoom
                        in={true}
                        timeout={{
                        enter: 300,
                        exit: 300
                    }}
                    unmountOnExit>
                        <StylerBtnPost color="primary" variant="fab" onClick={this.openBtn}><AddIcon/></StylerBtnPost>
                    </Zoom>
                    <Dialog
                        open={openDialog}
                        onClose={ this.closeBtn }
                        aria-labelledby="form-dialog-title"
                        TransitionComponent={Transition}>
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
                                    //input={< Input id = "name-native-error" />}
                                    value={selectedCat}
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
                                label="Subject"
                                type="text"
                                fullWidth/>
                            <TextField
                                onChange={this.bodyChange}
                                error={errorDialog.body}
                                multiline={true}
                                rows="8"
                                label="Write post here"
                                type="text"
                                fullWidth/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.submitBtn} color="primary">
                                Add Post
                            </Button>
                            <Button onClick={this.closeBtn} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                
               {super.render()}
            </Aux>
            )
        }
    }
}

export default withPostDialog