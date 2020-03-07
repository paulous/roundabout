import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
//import FolderIcon from '@material-ui/icons/Folder'
import { AccountIcon } from 'mdi-react'


const chatMessage = props => (
    <ListItem>
        <ListItemAvatar>
            <Avatar>
                <AccountIcon />
            </Avatar>
        </ListItemAvatar>
        <ListItemText 
            style={
                {
                    background:'white', 
                    borderRadius:'20px',
                    marginLeft:'5px'
                }}
            primary={props.data.message}
            secondary={

                `   Name: ${props.data.name} |
                    Sent: ${props.data.timestamp}
                `
            }
        />
    </ListItem>  
)

export default chatMessage