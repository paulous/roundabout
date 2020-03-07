import React, { Component } from 'react'
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js'

class draftPost extends Component {

    state = { 
        editorState: EditorState.createEmpty() 
    }

    onChange = (editorState) => this.setState({ editorState })

    handleKeyCommand(command, editorState) {

        const newState = RichUtils.handleKeyCommand(editorState, command)

        if (newState) {
            this.onChange(newState)
            return 'handled'
        }
        return 'not-handled'
    }
    render() {

        const raw = convertToRaw(this.state.editorState.getCurrentContent())
        
        return (
            <React.Fragment>
            <Editor
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
            />
            <div>{JSON.stringify(raw)}</div>
            </React.Fragment>
        )
    }
}

export default draftPost