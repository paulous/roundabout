import React, {Component} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import Zoom from '@material-ui/core/Zoom'
import styler from '../Styler/Styler'
import PostDialog from './PostDialog'
import Aux from '../../hoc/Aux/Aux'

class post extends Component {

    state = {
        init: false,
        
        //PostDialog
        openDialog: false,
        closeDialog: false,
        selectedCat: 0,
        subject: '',
        body: '',
        error: {
            category: false,
            subject: false,
            body: false
        }
    }

    render() {
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
                    <StylerBtnPost color="primary" variant="fab" onClick={this.dialogChange}><AddIcon/></StylerBtnPost>
                </Zoom>
                <PostDialog openDialog={this.state.openDialog} close={this.dialogChange} user={this.props.user} />
            </Aux>
        )
    }
}

export default post