import React, { PureComponent, lazy, Suspense } from 'react'
import { sockId, createOrDeleteRoom } from '../../api'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
//import CircularProgress from '@material-ui/core/CircularProgress'
//import MenuIcon from '@material-ui/icons/Menu'
import { MenuIcon } from 'mdi-react'
import styles from './styles'
import Sidebar from '../../containers/Sidebar/Sidebar'
import TopNav from '../../containers/TopNav/TopNav'
import Welcome from '../../components/Welcome/Welcome'
import Panel from '../../components/Panels/Panel'
import PostDialog from '../../components/PostDialog/PostDialog'
import ChatDialog from '../../components/ChatDialog/ChatDialog'
import SettingsDialog from '../../components/SettingsDialog/SettingsDialog'

//const Panel = lazy(() => import('../../components/Panels/Panel'))
//const PostDialog = lazy(() => import('../../components/PostDialog/PostDialog'))
//const ChatDialog = lazy(() => import('../../components/ChatDialog/ChatDialog'))

class ResponsiveDrawer extends PureComponent {

	state = {

		mobileOpen: false,
		fromPanel: {
			switchOn: true,
			key: null
		},
		access: false,
		user: null,
		userPostRooms:[],
		promptPostKey:'',

		openChatDialog:false,
		selectedPost:{user:'so chat not chock on init'},
		
		openSettingsDialog:false
	}

	handleDrawerToggle = () => {
		this.setState( state => ({ mobileOpen: !state.mobileOpen }))
	}

	signedIn = async user => {
		
		user.sockId = await sockId()

		this.setState({ access: true, user })
	}

	/*signOut = () => {
        this.setState({ access: false, user:null })
	}*/
	
	userPostRooms = ( action, key ) => this.setState( state => (
		{
			userPostRooms: action === 'add' 
			? [...state.userPostRooms, key]
			: state.userPostRooms.filter( pkey => pkey !== key )
		}
	), () => createOrDeleteRoom( { action, key } ) )

	promptUserPost = ( message, listItemPost ) => {
		
		listItemPost && this.openChatDialog( message )// from listItems, uses state msg
		this.setState({ promptPostKey: listItemPost ? '' : message.key })
	}


	openChatDialog = post => {// there is a panel post and a message post
        this.setState(
            {
                selectedPost:post, 
                openChatDialog:true, 
                loadChatDialog:true
            }
        )
    }

    closeChatDialog = () => this.setState({openChatDialog:false})
	
	openSettingsDialog = () => this.setState(
            {
                openSettingsDialog:true
            }
    	)

    closeSettingsDialog = () => this.setState({openSettingsDialog:false})

	render() {

		const { 			
			access, 
			user, 
			mobileOpen, 
			userPostRooms, 
			promptPostKey, 
			openChatDialog,
			selectedPost,
			openSettingsDialog
		} = this.state

		const { 
			classes, 
			theme, 
			openSnack, 
			isWidthUp, 
			width 
		} = this.props

		const brakepointSM = isWidthUp('sm', width)
		const brakepointMD = isWidthUp('md', width)

		console.log('access = ', access)

		const SidebarCopy = () => (
			<Sidebar
				user={user}
				userPostRooms={this.userPostRooms}
				promptUserPost={this.promptUserPost}
				promptPostKey={promptPostKey}
				signOut={this.signOut}
				openSnack={openSnack}
				openSettingsDialog={this.openSettingsDialog}
				brakepointSM={brakepointSM}
			/> 
		) 

		return (
			<div className={classes.root}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={this.handleDrawerToggle}
							className={classes.navIconHide}
						>
							<MenuIcon />
						</IconButton>

						<TopNav user={user} />

					</Toolbar>
				</AppBar>
				<Hidden mdUp>
					<Drawer
						variant="temporary"
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={this.handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>	
							{ !brakepointMD && SidebarCopy() }						
					</Drawer>
				</Hidden>
				<Hidden smDown implementation="css">
					<Drawer
						variant="permanent"
						open
						classes={{
							paper: classes.drawerPaper
						}}
					>
							{ brakepointMD && SidebarCopy() }						
					</Drawer>
				</Hidden>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{
						!access
							? 	<div style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									width: '100%'
								}}>
									<Welcome
										access={this.signedIn}
										openSnack={openSnack}
									/>
								</div>
							:	<React.Fragment>
									<Panel
										user={user}
										openSnack={openSnack}
										openChatDialog={this.openChatDialog}								
									/>
									<PostDialog
										user={user}
										openSnack={openSnack}
										brakepointSM={brakepointSM}									
									/>																			 
									<ChatDialog
										user={user}
										openSnack={openSnack}
										userPostRooms={userPostRooms}
										promptUserPost={this.promptUserPost}
												
										openChatDialog={openChatDialog}
										closeChatDialog={this.closeChatDialog}
										selectedPost={selectedPost}

										brakepointSM={brakepointSM}
									/>	
								</React.Fragment>								
					}

				</main>
				{
					access &&
						<SettingsDialog 
							user={user}
							openSettingsDialog={openSettingsDialog} 
							closeSettingsDialog={this.closeSettingsDialog}
						/>
				}
			</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })( ResponsiveDrawer )
