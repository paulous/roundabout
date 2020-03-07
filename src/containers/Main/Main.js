import React, {PureComponent} from 'react'
import Panel from '../../components/Panels/Panel'
import PostDialog from '../../components/PostDialog/PostDialog'
import ChatDialog from '../../components/ChatDialog/ChatDialog'

class main extends PureComponent {// Main shouldn't update

    
    render() {

        const {
            openChatDialogFn, 
            openChatDialog, 
            closeChatDialog, 
            selectedPost,
            loadChatDialog
        } = this.props

        return (
            <div style={
                {
                    overflow:'hidden',
                    background:'whitesmoke'
                }}>
                <Panel 
                    {...this.props} 
                />
                <PostDialog 
                    { ...this.props } 
                />
                {
                    loadChatDialog &&
                        <ChatDialog
                            { ...this.props } 
                        />
                }
            </div>
        )
    }
}

export default main