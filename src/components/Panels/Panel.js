import React, { PureComponent, lazy, Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { AccountCircleIcon, ForumIcon } from 'mdi-react'
import Zoom from '@material-ui/core/Zoom'
import Collapse from '@material-ui/core/Collapse'
import Slide from '@material-ui/core/Slide'
import Tabs from '../Tabs/Tabs'
import styler from '../Styler/Styler'
import PanelItems from './PanelItems'
import Chipbar from '../Chipbar/Chipbar'
import FilterQueryBtn from '../FilterQuery/FilterQueryBtn'

const DraftEditor = lazy(() => import('../Draft/DraftWysiwyg'))

const StylerDetails = styler(ExpansionPanelDetails)(theme => ({ padding: '0 24px 24px', display: 'flex', flexDirection: 'column' }))

let wasModifiedKey = 0

class panel extends PureComponent {

    state = {
        expanded: null,
        tabs: null,
        loaded: [],
        trans: false,
        isTabsLoading: false,
        userPost: true,
        addModRmv:'',
        queryProp:'queries.lev_2',
        queryVal:this.props.user.location.lev_2
        //wasModifiedKey:0
    }

    componentDidMount = () => {

        const { user, openSnack } = this.props

        let newUser = user.visits
            ? `Welcome back ${user.name}.`
            : `Welcome to Roundabout ${user.name}`

        openSnack('success', newUser)
    }

    expandChange = index => (event, expanded) => {

        this.setState({
            expanded: expanded
                ? index
                : false,
            trans: false
        })
    }

    tabsChange = tabs => event => {

        event.stopPropagation()

        const { loaded, trans } = this.state
        this.setState({
            tabs,
            loaded: loaded.some(v => v === tabs)
                ? [...loaded]
                : [...loaded, tabs],
            trans: !trans,
            isTabsLoading: false
        })
    }

    openChatDialog = post => event => {
        event.stopPropagation()
        this.props.openChatDialog( post )
    }

    addModRmv = addModRmv => this.setState({ addModRmv })

    changeQuery = (queryProp, queryVal) => this.setState({ queryProp, queryVal })

    render() {

        const {
            expanded,
            trans,
            tabs,
            loaded,
            isTabsLoading,
            addModRmv,
            queryProp,
            queryVal
            //wasModifiedKey
        } = this.state

        const { user } = this.props

        const center = {
            width:'100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-evenly'
        }

        const Panel = ( post, indx ) => (
            <Slide in={true} direction='up' key={`key${indx}`}>
                <ExpansionPanel                
                    onChange={this.expandChange(indx, post)}
                    expanded={expanded === indx}
                    //CollapseProps={{collapsedHeight:'100px'}}
                >
                    <ExpansionPanelSummary>                        
                        { 
                            expanded === indx 
                            ?   <Zoom
                                    in={expanded === indx}
                                    timeout={{
                                        enter: 300,
                                        exit: 300
                                    }} 
                                    unmountOnExit
                                >
                                    <div style={ {...center, flexFlow:'wrap-reverse'} }>
                                        <div style={{display:'flex'}}>
                                            <Button
                                                style={{margin:'0 18px'}}
                                                color="secondary"
                                                variant="fab"
                                                onClick={this.tabsChange(indx)}
                                            >
                                                <AccountCircleIcon />
                                            </Button>
                                            <Button                                            
                                                color="secondary"
                                                variant="fab"
                                                onClick={this.openChatDialog( post )}
                                            >
                                                <ForumIcon />
                                            </Button>
                                        </div>

                                        <Chipbar post={post} fontSize={'1rem'} iconSize={24} />
                                    </div>
                                </Zoom> 
                            :   <Typography variant="subheading">
                                    {post.subject}
                                </Typography> 
                        }                        
                    </ExpansionPanelSummary>
                    <StylerDetails>
                        <Paper elevation={0}>                                                                              

                            <Typography 
                                component="h2" 
                                variant='display1'
                                align='center'
                            >
                                { post.subject } 
                            </Typography>
                            <Typography component="h3" variant='caption' gutterBottom align='center'>

                                Email: {post.user.email} Created: {post.created}

                            </Typography>
                            
                                 <div style={center}>
                                    <Suspense fallback={<CircularProgress />}>
                                        <DraftEditor 
                                            panelPostBodyRaw={post.body} 
                                            isFromPanel={addModRmv}
                                            key={wasModifiedKey += 1}
                                            {...this.props} 
                                        />
                                    </Suspense>                             
                                </div> 
                                                                 
                        </Paper>
                        {
                            indx === tabs || loaded.some(v => v === indx)
                                ? <Collapse
                                    in={trans}
                                    timeout={{
                                        enter: 500,
                                        exit: 500
                                    }}>
                                    {isTabsLoading
                                        ? <CircularProgress />
                                        : <Tabs data={post} user={user} />}
                                </Collapse>
                                : <noscript />
                        }
                    </StylerDetails>
                </ExpansionPanel>
            </Slide>
        )

        return (
            <React.Fragment>
                <FilterQueryBtn changeQuery={this.changeQuery} {...this.props} />
                <PanelItems 
                    key={queryVal} 
                    prop={queryProp} 
                    val={queryVal} 
                    Panel={Panel} 
                    addModRmv={this.addModRmv} 
                    {...this.props} 
                />
            </React.Fragment>

        )
    }
}

export default panel