import React, {PureComponent} from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'

class filterQueryBtn extends PureComponent {
    state = {
      anchorEl: null,
      changeBtnName:this.props.user.location.lev_2
    }
  
    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget })
    }
  
    handleClose = () => {
      this.setState({ anchorEl: null })
    }

    changeQuery = (prop, val) => event => {
        this.handleClose()
        this.props.changeQuery( prop, val )
        this.setState({changeBtnName:val === 'all' ? 'World' : val})
    }
  
    render() {
      const { anchorEl, changeBtnName } = this.state
      const { location } = this.props.user
  
      return (
            <Paper elevation={1} style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                background: '#f3f9f9',
                position:'fixed',
                zIndex:'1'
            }}>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    { changeBtnName }
          </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.changeQuery('queries.lev_2', location.lev_2)}>{location.lev_2}</MenuItem>
                    <MenuItem onClick={this.changeQuery('queries.lev_1', location.lev_1)}>{location.lev_1}</MenuItem>
                    <MenuItem onClick={this.changeQuery('queries.lev_0', location.lev_0)}>{location.lev_0}</MenuItem>
                    <MenuItem onClick={this.changeQuery('queries.all', 'all')}>World</MenuItem>
                </Menu>
            </Paper>
        )
    }
}
  
  export default filterQueryBtn