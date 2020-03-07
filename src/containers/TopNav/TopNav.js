import React from 'react'
import Typography from '@material-ui/core/Typography'

class topNav extends React.Component {

  
  render() {

    return (
        <Typography variant="title" color="inherit" noWrap>
         {this.props.user ? this.props.user.name : 'Where are you?'} is Roundabout
      </Typography>
    )
  }
}

export default topNav