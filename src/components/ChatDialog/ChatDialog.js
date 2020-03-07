import React, { PureComponent } from 'react'
import 
{ 
    messageListen, 
    newMessage, 
    joinRoom, 
    joinYourRoom, 
    leaveRoom,
    promptUser,
    promptCallback,
    snackMessage,
    typing,
    isTyping
} from '../../api'
import ChatMessage from './ChatMessage'
import ClientChatMessage from './ClientChatMessage'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Slide from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import TextField from '@material-ui/core/TextField'
import { CloseIcon, SendIcon, CommentTextOutlineIcon } from 'mdi-react'
import createStyled from 'material-ui-render-props-styles/index'
import Typing from './Typing'
import Chipbar from '../Chipbar/Chipbar'

const StyledDialogContent = createStyled( theme => {
    return {
        root: {
            margin:'0',
            padding:'0',
            height:'40vh',
            display:'flex',
            flexDirection: 'column-reverse',
            background: theme.palette.grey.A100
        }
    }
})

const Transition = props => ( <Slide direction="up" {...props} /> )

class chatDialog extends PureComponent {

    state = {
        messages: [],
        msgText: '',
        isMyRoom:false,
        typing:false
    }

    componentDidMount = () => {

        const { openSnack, promptUserPost } = this.props

        messageListen( ( err, message ) => {// message spiget for user posts

            if( this.props.openChatDialog ){

                if(this.props.selectedPost.key === message.key){

                    this.setState( state =>  ({ messages:[ ...state.messages, message ] }))}
                else{

                    openSnack( 'info', `Incoming message: ${message.message}. -- Dialog is OPEN ` )
                    promptUserPost( message, false )
                }                    
            }
            else{
                openSnack( 'info', `Incoming message. -- Dialog is CLOSED ${message.message}` )
                promptUserPost( message, false )
            }

        })

        promptCallback( ( err, message ) => console.log('promp was called...', message ))

        snackMessage( ( err, message ) => openSnack( 'info', message ))

        typing( is => this.setState({ typing: is }))
    }

    componentDidUpdate = prevProp => {

        const { openChatDialog } = this.props

        if ( prevProp.openChatDialog !== openChatDialog && openChatDialog ){
            this.joinRoomType()
        }
    }

    joinRoomType = () => {

        const { user, selectedPost, userPostRooms } = this.props

        let roomCallBack = (err, messages) => {
            this.setState({ messages: messages !== null ? messages : {} })
        }

        let joinData = 
        { 
            key: selectedPost.key, 
            host: selectedPost.user.name, 
            guest: user.name
        }

        let isMyRoom = userPostRooms.some( room => selectedPost.key === room)

        this.setState({ isMyRoom })
        
        isMyRoom
            ? joinYourRoom( joinData, roomCallBack )
            : joinRoom( joinData, roomCallBack )
    }

    chatChange = event => {
        this.setState({msgText: event.target.value})
    }

    chatSend = event => {

        const { user, selectedPost } = this.props

        promptUser( selectedPost.user.sockId )

        let message = { 
            message: this.state.msgText, 
            key: selectedPost.key,
            name: user.name,           
            uid: user.uid,           
            timestamp: new Date().toLocaleString()
        }

        newMessage( message )

        this.setState( state => ({ messages:[ ...state.messages, message ], msgText:''}))
    }

    isTyping = key => event => isTyping( key )

    enterKeyPressed = event => {
        if (event.keyCode === 13) {
            this.setState({ msgText: event.target.value }, () => this.chatSend())            
        }
    }

    close = () => {

        const { user, closeChatDialog, selectedPost } = this.props

        closeChatDialog()
        
        leaveRoom(
            { 
                host: selectedPost.user.name, 
                guest: user.name,
                key: selectedPost.key 
            })

        this.setState(
            {
                messages:[], 
                msgText:''
            }
        ) 
    }

    render(){

        const { messages, msgText, typing } = this.state
        const { user, selectedPost, openChatDialog, brakepointSM } = this.props

        return(
            <Dialog
                open={openChatDialog}
                TransitionComponent={Transition}
                fullWidth={true}
                fullScreen={!brakepointSM}
                //maxWidth='lg'
                keepMounted
                onClose={this.close}
            > 
                {
                    brakepointSM && openChatDialog
                    ?   <div style={{
                                display:'flex',
                                flexFlow: 'row wrap',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                padding: !brakepointSM ? '18px 70px 18px 10px' : '18px',
                                borderBottom:'1px solid lightgray'
                            }}
                        >      
                            <Chipbar post={selectedPost} fontSize={'1rem'} iconSize={24} />
                        </div>
                    
                    :   <div style={{
                            position:'absolute',
                            top:'10px',
                            right:'10px',
                            zIndex:'10'
                            }}
                        >    
                            <Button onClick={this.close} ><CloseIcon size={36} /></Button>
                        </div>
                }
                <StyledDialogContent style={{display:'flex', flexFlow:'column-reverse'}}>
                    {
                        ({ classes }) => (
                            <DialogContent className={classes.root}>
                                <List>                                                                                                            
                                    {
                                        messages.length
                                        ?   messages.map( (data, i) => (

                                                <Slide in={true} direction='up' key={`key${i}`}>
                                                    {
                                                        data.uid === user.uid
                                                            ? <ClientChatMessage data={data} {...this.props} />
                                                            : <ChatMessage data={data} {...this.props} />
                                                    }
                                                    </Slide>
                                            ))

                                        :   <Typography align="center" component="h2" variant="display1" gutterBottom>
                                                <CommentTextOutlineIcon size={36} />
                                                <strong>{selectedPost.user.name } say's:</strong>   {selectedPost.subject}
                                            </Typography>
                                    } 
                                    { typing && <Typing /> }                                                                                                                                                                                       
                                </List>
                            </DialogContent>
                        )
                    }
                </StyledDialogContent>
                <DialogContent style={{
                    display:'flex',
                    flexFlow: 'column',
                    justifyContent: 'space-evenly',
                    borderTop:'1px solid lightgray'
                }}>
                    <DialogActions>                        
                        <TextField                            
                            onChange={this.chatChange}
                            onKeyUp={this.isTyping( selectedPost.key)}
                            onKeyDown={this.enterKeyPressed}
                            value={msgText}
                            label='Chat message'
                            type="text"
                            maxLength="100"
                            fullWidth
                        />

                        <Button 
                            onClick={this.chatSend} 
                            color="primary" 
                        >
                            <SendIcon size={36} />
                        </Button>

                    </DialogActions>
                    <Button 
                        disabled={true} 
                        variant="contained" 
                        size="large" 
                        color="primary" 
                        fullWidth={true}
                    >
                        Agree to Terms
                    </Button>
                </DialogContent>                                
            </Dialog>
        )
    }
}

export default chatDialog