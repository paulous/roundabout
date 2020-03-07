import React, {PureComponent} from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { CloseIcon } from 'mdi-react'
import Slide from '@material-ui/core/Slide'
import { deleteUser } from '../../Firebase/auth'


const styles = {
    appBar: {
        position: 'relative'
    },
    flex: {
        flex: 1
    },
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class FullScreenDialog extends PureComponent {

    delete = () => {
		deleteUser( () => window.location.reload() )
	}

    render() {

        const { classes, user, openSettingsDialog, closeSettingsDialog } = this.props

        return (
            <div>
                <Dialog
                    fullScreen
                    open={openSettingsDialog}
                    onClose={closeSettingsDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={closeSettingsDialog} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {`Settings for ${user.name}`}
                            </Typography>
                            <Button color="inherit" onClick={this.handleClose}>
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <ListItem button>
                            <ListItemText 
                            primary="Edit Profile" 
                            secondary="Make changes to your account password" />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemText 
                            primary="Reset Email Address " 
                            secondary="Change your account email address" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText 
                            primary="Change Password" 
                            secondary="Make changes to your account password" />
                        </ListItem>
                        <ListItem button onClick={this.delete}>
                            <ListItemText 
                            primary="Delete Account " 
                            secondary="Delete your account and everything related to your identity" />
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(FullScreenDialog)
