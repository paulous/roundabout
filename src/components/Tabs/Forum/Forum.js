import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'

const forum = (props) => {
	return (
		<div>
			<Paper elevation={0}>
				<Paper elevation={1}>
					<Typography component="p">
						This is an example message.
					</Typography>
				</Paper>
				<Paper elevation={1}>
					<Typography component="p">
						This is another example message.
					</Typography>
				</Paper>

				<Input
					placeholder="Enter chat message"
					inputProps={{
						'aria-label': 'Description',
					}}
				/>
				<Button variant="contained" color="primary">
					Send
				</Button>
			</Paper>
		</div>
	)
}

export default forum