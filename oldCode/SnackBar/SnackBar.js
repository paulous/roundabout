import React, {Component} from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const snackbar = class extends Component {

    queue = []

    state = {
        error: null,
        messageInfo: {}
    }

    handleClick = message => () => {
        this
            .queue
            .push({
                message,
                key: new Date().getTime()
            })

        if (this.props.open) {
            // immediately begin dismissing current message to start showing new one
            this.props.reset()
        } else {
            this.processQueue()
        }
    }

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift()
            })
            this.props.reset()
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        this.props.reset()
    }

    handleExited = () => {
        this.processQueue();
    }

    errorConfirmedHandler = () => {
        this.setState({error: null})
    }

    render() {

        const {message, key} = this.state.messageInfo

        return (
            <Snackbar
                key={key}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
                open={this.props.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
                onExited={this.handleExited}
                ContentProps={{
                'aria-describedby': 'message-id'
            }}
                message={<span id = "message-id" > { this.handleClick( this.props.message ) } </span>}
                action={ 
                    <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleClose} > 
                        <CloseIcon /> 
                    </IconButton>}
            />          
        )
    }
}


export default snackbar