import React from 'react'
import TopNav from '../../containers/TopNav/TopNav'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'

const appBar = props => (
    <AppBar className={props.classes.appBar}>
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={props.handleDrawerToggle}
        className={props.classes.navIconHide}
      >
        <MenuIcon />
      </IconButton>
      <TopNav />
    </Toolbar>
  </AppBar>
)

export default appBar