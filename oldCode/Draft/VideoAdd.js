import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import { FileVideoIcon } from 'mdi-react'

export default class VideoAdd extends Component {
    // Start the popover closed
    state = {
        url: '',
        anchorEl: null,
        open: false
    }

    openPopover = event => this.setState({anchorEl: event.currentTarget})

    closePopover = () => this.setState({anchorEl: null})

    addVideo = () => {
        const {editorState, onChange} = this.props
        onChange(this.props.modifier(editorState, {src: this.state.url}))
        this.closePopover()
    }

    changeUrl = (evt) => {
        this.setState({url: evt.target.value})
    }

    render() {

        const { anchorEl, url } = this.state
        const open = Boolean(anchorEl)

        return (
            <div>
                <Button
                    size='small'
                    aria-owns={open
                    ? 'simple-popper'
                    : null}
                    variant="outlined"
                    aria-haspopup="true"
                    onClick={this.openPopover}>
                    Add Video &nbsp; <FileVideoIcon />
                </Button>
                <Popover
                    id="simple-popper"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.closePopover}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}>
                    <div style={{padding:'5px'}}>
                        <TextField
                            placeholder="Paste the video url …"
                            onChange={this.changeUrl}
                            value={url}
                            type="text"
                            maxLength="50"
                        />
                        <Button size='small' onClick={this.addVideo}>Add</Button>
                </div>

                </Popover>
            </div>
        )
    }
}