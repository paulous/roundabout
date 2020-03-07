import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const money = (props) => {
  return (
    <div>
      <Paper elevation={0}>
        <Typography variant="headline" component="h3">
          This is a sheet of paper. Money
        </Typography>
        <Typography component="p">
          Paper can be used to build surface or other elements for your application.
        </Typography>
      </Paper>
    </div>
  )
}

export default money