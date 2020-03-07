import React, {Component} from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Portal from '@material-ui/core/Portal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const snackbar = class extends Component {

    state = {
        snackOpen:false,
        oldMessage:''
    }

    messageQueue = []     
    snackInfo = {message:'', key:null}   

    openSnack = message => {

        const { snackOpen, oldMessage } = this.state

        if( oldMessage === message ) return

        this.messageQueue.push({
                message,
                key: new Date().getTime()
            })

        snackOpen
        ? this.setState({snackOpen:false, oldMessage:message})
        : this.snackQueue() 
    }

    snackQueue = () => {

        if (this.messageQueue.length > 0) {

            this.snackInfo = this.messageQueue.shift()               
            this.setState({snackOpen:true})
        }
    }

    snackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.setState({snackOpen:false})

    }

    snackExited = () => this.snackQueue()
    
    render(){

        const { snackOpen } = this.state
        const { message, key } = this.snackInfo

        return (
            <Aux> 
                <Portal>
                    <Snackbar
                        key={key}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                        }}
                        open={ snackOpen }
                        autoHideDuration={6000}
                        onClose={this.snackClose}
                        onExited={this.snackExited}
                        ContentProps={{
                        'aria-describedby': 'message-id'
                    }}
                        message={<span id = "message-id" > { message } </span>}
                        action=
                        { 
                            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.snackClose} > 
                                <CloseIcon /> 
                            </IconButton>
                        }
                    />
                </Portal>
            </Aux>
        )
    }
}



export default snackbar