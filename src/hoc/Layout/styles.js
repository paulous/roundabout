//import React from 'react'

const drawerWidth = 300


const styles = theme => ({
        root: {
          flexGrow: 1,
          zIndex: 1,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          width: '100%'
        },
        appBar: {
          position: 'fixed',
          marginLeft: drawerWidth,
          [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`
          }
        },
        navIconHide: {
          [theme.breakpoints.up('md')]: {
            display: 'none'
          }
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
          width: drawerWidth,
          [theme.breakpoints.up('md')]: {
            position: 'relative'
          }
        },
        content: {
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          padding: 0,
          margin:0
        }
      }
)

export default styles