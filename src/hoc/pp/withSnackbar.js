import React, {Component} from 'react'
import createStyled from 'material-ui-render-props-styles/index'
import classNames from 'classnames'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Portal from '@material-ui/core/Portal'
import IconButton from '@material-ui/core/IconButton'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import { WindowCloseIcon, AlertIcon, CheckboxMarkedIcon, InformationIcon, SkullIcon  } from 'mdi-react'

const StyledSnackbar = createStyled( theme => (
    {
        success: {
            backgroundColor: green[600],
        },
        error: {
            backgroundColor: theme.palette.error.dark,
        },
        info: {
            backgroundColor: theme.palette.primary.dark,
        },
        warning: {
            backgroundColor: amber[700],
        },
        icon: {
            fontSize: 20,
        },
        iconVariant: {
            opacity: 0.9,
            marginRight: theme.spacing.unit,
        },
        message: {
            display: 'flex',
            alignItems: 'center',
        }
    })
)

const variantIcon = {
    success: CheckboxMarkedIcon,
    warning: AlertIcon,
    error: SkullIcon,
    info: InformationIcon
}

const snackBar = Wrapped => {

    return class snack extends Component{

        state = {
            snackOpen:false,
            oldMessage:''
        }

        messageQueue = []   
          
        snackInfo = {message:'', variant:'success', key:null}   
    
        openSnack = ( variant, message ) => {

            const { snackOpen, oldMessage } = this.state

            if( oldMessage === message ) return

            this.messageQueue.push({
                    message,
                    variant,
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
            const { message, variant, key } = this.snackInfo

            const Icon = variantIcon[ variant ]

            return (
                <React.Fragment> 
                    <Wrapped openSnack={this.openSnack} {...this.props} />   

                    <Portal>
                        <StyledSnackbar>
                            {
                                ({classes}) => (
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
                                    >                                    
                                        <SnackbarContent
                                            className={classNames(
                                                {
                                                    [`${classes.info}`]: variant === 'info', 
                                                    [`${classes.error}`]: variant === 'error', 
                                                    [`${classes.warning}`]: variant === 'warning', 
                                                    [`${classes.success}`]: variant === 'success'
                                                }
                                            )}
                                            aria-describedby="client-snackbar"
                                            message={
                                                <span id="client-snackbar" className={classes.message}>
                                                <Icon className={classNames(classes.icon, classes.iconVariant)} />
                                                {message}
                                                </span>
                                            }
                                            action=
                                            { 
                                                <IconButton key="close" aria-label="Close" color="inherit" onClick={this.snackClose} > 
                                                    <WindowCloseIcon /> 
                                                </IconButton>
                                            }
                                        />                                                                                                                                                
                                    </Snackbar>
                                )
                            }
                        </StyledSnackbar>
                    </Portal>
                </React.Fragment>

            )
        }
    }

}

export default snackBar