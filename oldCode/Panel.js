import React, {Component} from 'react'
import fb from '../../Firebase/Firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Switch from '@material-ui/core/Switch'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import UpIcon from '@material-ui/icons/KeyboardArrowUp'
import Zoom from '@material-ui/core/Zoom'
import Collapse from '@material-ui/core/Collapse'
import Tabs from '../Tabs/Tabs'
import styler from '../Styler/Styler'
import withFirestoreUpdates from '../../hoc/ii/withFirestoreUpdates'
import PanelItems from './PanelItems'

const PanelItemsWithFsUpdates = withFirestoreUpdates( PanelItems )

const StylerDetails = styler(ExpansionPanelDetails)(theme => ({padding: '0 24px 24px', display: 'flex', flexDirection: 'column'}))


class panel extends Component {

    state = {
        expanded: null,
        tabs: null,
        loaded: [],
        trans: false,
        isTabsLoading: false,
        userPost:true,
    }

    componentDidMount = () => {

        const { user, openSnack } = this.props

        let newUser = user.visits
        ? `Welcome to Roundabout ${user.name}`  
        : `Welcome back ${user.name}.`
        
        openSnack(newUser)
    }

    ChangeQuerie = q => {
        this.setState({querie:q})
    }

    expandChange = panel => (event, expanded) => {

        this.setState({
            expanded: expanded
                ? panel
                : false,
                trans:false
        })
    }

    tabsChange = tabs => event => {
        const {loaded, trans} = this.state
        this.setState({
            tabs,
            loaded: loaded.some(v => v === tabs)
                ? [...loaded]
                : [
                    ...loaded,
                    tabs
                ],
            trans: !trans,
            isTabsLoading: false
        })
    }

    removePanel = key => event => {

        const { openSnack, layout } = this.props

        fb
            .firestore()
            .collection('posts')
            .doc(key)
            .delete()

            layout.userPosts({ switchOn:false, key })
            openSnack('Post inactive! You can reactivate it from the sidebar.')
    }

    render() {

        const { 
            expanded,
            trans,
            tabs,
            loaded,
            isTabsLoading,
            userPost
         } = this.state


        const { user } = this.props

        const Panel = (post, i) => (
            <ExpansionPanel
                key={i.toString()}
                expanded={expanded === i}
                onChange={this.expandChange(i)}>
                <ExpansionPanelSummary>
                    <Typography variant="subheading" noWrap={true}>
                        {post.subject}
                    </Typography>
                    {
                        user.uid === post.user.uid &&
                        <div style={{position:'absolute', top:0, right:0, paddingRight:0}}>
                            <Switch
                                checked={userPost}
                                onChange={this.removePanel(post.key)}
                                color="default"
                            />
                        </div>
                    }
                </ExpansionPanelSummary>
                <StylerDetails>
                    <Paper elevation={0}>
                    <Chip label={post.category} />
                        <Typography component="div">
                           <p> User: {user.name}
                            <br/>
                            Email: {user.email}
                            <br/> 
                            Created: {/*console.log(new Date(post.timestamp.seconds*1000).toDateString())*/ 'set date on post sometime'}</p>
                            <p>{post.body}</p>
                        </Typography>
                    </Paper>

                    <Zoom
                        in={expanded === i}
                        timeout={{
                        enter: 500,
                        exit: 500
                    }}
                        unmountOnExit>
                        <Button 
                        style={{alignSelf: 'flex-end', position:'absolute'}} 
                        color="secondary" 
                        variant="fab" 
                        onClick={this.tabsChange(i)}
                        ><UpIcon/>
                        </Button>
                    </Zoom>

                    {
                        i === tabs || loaded.some(v => v === i)
                        ? <Collapse
                                in={trans}
                                timeout={{
                                enter: 500,
                                exit: 500
                            }}>
                                {isTabsLoading
                                    ? <CircularProgress/>
                                    : <Tabs data={post} user={user}/>}
                            </Collapse>
                        : <noscript/>
                    }                    
                </StylerDetails>
            </ExpansionPanel>
        )

        return (
            <PanelItemsWithFsUpdates panel={Panel} />
        )
    }
}

export default panel