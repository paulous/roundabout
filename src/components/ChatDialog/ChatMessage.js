import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
//import FolderIcon from '@material-ui/icons/Folder'
import { AccountIcon } from 'mdi-react'

const chatMessage = props => (
    <ListItem>
        <ListItemText
            style={
                {
                    background:'whitesmoke', 
                    borderRadius:'20px',
                    marginRight:'5px',
                    paddingLeft:'25px',
                    textAlign:'right'
                }}
            primary={props.data.message}
            secondary={

                `   Name: ${props.data.name} |
                    Sent: ${props.data.timestamp}
                `
            }
            />
        <ListItemAvatar>
            <Avatar>
                <AccountIcon />
            </Avatar>
        </ListItemAvatar>
    </ListItem>  
)

export default chatMessage