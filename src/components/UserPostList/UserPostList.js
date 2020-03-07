import React, { PureComponent } from 'react'
import PostDialog from '../PostDialog/PostDialog'
import ListItems from './ListItems'

class userPostList extends PureComponent {

	state = {
		openDialogExt: false,
		postToEdit: {}
	}

	openDialogExt = post => event => {

		this.setState({ openDialogExt: true, postToEdit: post })
	}

	closeDialogExt = event => {
		this.setState({ openDialogExt: false })
	}

	render() {

		const { postToEdit, openDialogExt } = this.state

		return (
			<React.Fragment>
				<ListItems
					openDialogExt={this.openDialogExt}
					{...this.props}
				/>

				<PostDialog
					openDialogExt={openDialogExt}
					closeDialogExt={this.closeDialogExt}
					postToEdit={postToEdit}
					{...this.props}
				/>
			</React.Fragment>
		)
	}
}

export default userPostList
