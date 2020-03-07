import React, {Component} from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

class profile extends Component {

    render() {

        return (
                <Paper elevation={0}>
                    <Typography variant="headline" component="h3">
                        Profile
                    </Typography>
                    <Typography component="div">
                        <div>hello</div>
                        {console.log('This is Profile data', this.props.data)}
                    </Typography>
                </Paper>

        )
    }
}

export default profile