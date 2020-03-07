import React, { PureComponent } from 'react'
//import memoize from "memoize-one"
import fb from '../../Firebase/Firebase'
import { deleteRoomMessages } from '../../api'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import NoPosts from '../NoPosts/NoPosts'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
//import EditIcon from '@material-ui/icons/Edit'
import { PencilIcon } from 'mdi-react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { fsUpdate } from '../Firestore/firestore'
import styled from 'styled-components'
import { pulse } from '../Keyframes/Keyframes'

const MessagePrompt = styled.div`
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background: #CFD8DC;
    z-index:-1;
    animation: ${pulse} .7s ease-in-out 1s infinite alternate;
`
const promptKeyQue = {}

class listItems extends PureComponent {

    state = {
        checked: false,
        noPosts:false,

        //fs
        isLoading: true,
        fsData: []
    }

    componentDidMount = () => {

        const { user, userPostRooms } = this.props

        fsUpdate(
            {
                doc: fb
                    .firestore()
                    .doc(`users/${user.uid}`)
                    .collection('posts'),
                querie: {
                    prop: 'queries.lev_2',
                    cond: '==',
                    val: user.location.lev_2
                }
            },

            ( noPosts, isLoading ) => this.setState( {noPosts, isLoading} ), // noPosts available

            ( data, loading ) => this.setState( state => { //added

                data.forEach( post => {

                    if( state.isLoading ){
                        post.live = false
                    }

                    userPostRooms( 'add', post.key )
                })

                return { fsData: [...state.fsData, ...data], isLoading:loading, noPosts:false }
            }),

            data => this.setState( state => { //modified

                let fsDataCopy = [...state.fsData]
                let replace = state.fsData.findIndex( elm => (elm.key === data.key) )
                fsDataCopy.splice(replace, 1, data)

                return { fsData: fsDataCopy }
            }),

            key => this.setState( state =>  {//removed

                userPostRooms( 'remove', key )

                return { 
                    fsData: state.fsData.filter( p => p.key !== key ),
                    [ key ]: undefined
                }
            }),

            this.props.openSnack
        )
    }

    addOrRemovePanel = post => event => {

        const { user, openSnack } = this.props

        let checked = event.target.checked
        let fs = fb.firestore().doc(`posts/${post.key}`)

        post.live = checked ? true : false

        if( checked ){
            
            fs
            .set(post)
            .then(() => {
                this.setState({ [ post.key ]: false })

                openSnack('success', `${user.name}.  Your post is live.  Edit from the sidebar.`)
            })
            .catch(error => openSnack('error', error.message))
        }
        else{

            fs
            .delete()
            .then(() => {
                this.setState({ [ post.key ]: true })
                openSnack('info', 'Post inactive! Reactivate it from the sidebar.')
            })
            .catch(error => openSnack('error', error.message))

            deleteRoomMessages( post.key )
        }

    }

    promptClicked = post => event => { // call layout, return prompt post
        
        delete promptKeyQue[ post.key ] 
        this.props.promptUserPost( post , true )
        this.forceUpdate()
    }

    render() {

        const { fsData, isLoading, noPosts } = this.state
        const { openDialogExt, promptPostKey } = this.props

        if( !promptKeyQue.hasOwnProperty( promptPostKey ) ) {

            promptKeyQue[ promptPostKey ] = promptPostKey
        } 

        return (
            <React.Fragment>
                {
                    isLoading
                    ?   <CircularProgress />
                    :   !noPosts
                            ?   <List subheader={<ListSubheader> Posts </ListSubheader>}>
                                    {
                                        fsData.map(( post, i ) => {

                                            let prompt = promptKeyQue.hasOwnProperty( post.key )
                                            
                                            return (
                                                <ListItem 
                                                    button = { prompt } 
                                                    onClick = { prompt ? this.promptClicked( post ) : null} 
                                                    key = {`key${i}`}
                                                    disableGutters
                                                >
                                                    { 
                                                        prompt ? <MessagePrompt  /> : <noscript/>
                                                    }
                                                    <ListItemText
                                                        style={{
                                                            paddingRight: '85px'
                                                        }}
                                                        primary={post.subject} 
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton disabled={prompt} onClick={openDialogExt( post )} aria-label="Edit">
                                                            <PencilIcon />
                                                        </IconButton>
                                                        <Switch
                                                            defaultChecked={ post.live }
                                                            disabled={prompt}
                                                            value={`listItem${i}`}
                                                            onChange={ this.addOrRemovePanel( post ) }
                                                            color="default"
                                                        />
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            :   <NoPosts
                                    text={
                                        `
                                            You haven't made a post yet. 
                                            Give it a go. You don't have to publish it live 
                                            right away. Just hit save and you control what goes live.
                                        `
                                    }
                                 />
                }
            </React.Fragment>
        )
    }

}

export default listItems