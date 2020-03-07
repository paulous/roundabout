import React, { PureComponent, lazy, Suspense } from 'react'
import fb from '../../Firebase/Firebase'
import Button from '@material-ui/core/Button'
//import CircularProgress from '@material-ui/core/CircularProgress'
import UserPostList from '../../components/UserPostList/UserPostList'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import { SettingsIcon, LogoutIcon } from 'mdi-react'

//const UserPostList = lazy(() => import('../../components/UserPostList/UserPostList'))

const StyledContainer = styled.div`
	position:fixed;
	width:300px;
`

const StyledBtnGroup = styled.div`
	display:flex;
	align-items:center;
	justify-content:space-evenly;
	padding:15px 0 15px 0;
`

class sidebar extends PureComponent {

	signOut = () => {

		fb
		.firestore()
		.doc(`users/${this.props.user.uid}`)
		.collection('posts')
		.get()
		.then( snap => {
			
			snap.docs.forEach( (post, i, arr) => {
				console.log('posts for deletion', post.id)

				fb
				.firestore()
				.doc(`${this.props.user.location.address.path}/posts/${post.id}`)
				.delete()
				.then( () => {

					i === arr.length - 1 && fb
					.auth()
					.signOut()
					.then(() => {
							console.log('deleted all the posts')
							//this.props.signOut()
							window.location.reload()
						})
					}
				)
				.catch(error => this.props.openSnack( 'error', error.message))
			})
		})
	}

	render() {

		return (
			<React.Fragment>
				{
					this.props.user
						? <StyledContainer>
							<StyledBtnGroup>								
								<Button onClick={this.props.openSettingsDialog} >Settings &nbsp; <SettingsIcon size={24} /></Button>
								<Button onClick={this.signOut} >Log Out &nbsp; <LogoutIcon size={24} /></Button>
							</StyledBtnGroup>
							<Divider light />
								<UserPostList {...this.props} />
						</StyledContainer>
						: ' Where are you?'
				}
			</React.Fragment>
		)
	}
}

export default sidebar