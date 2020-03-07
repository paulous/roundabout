import React, { Component } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import './react-draft-wysiwyg.css'
import './my-wysiwyg-styles.css'

const MAX_LENGTH = 300

const options =  [
    'embedded', 
    'image',
    'emoji', 
    'colorPicker', 
    'inline', 
    'link', 
    'blockType', 
    'fontSize', 
    'fontFamily', 
    'textAlign', 
    'list'
] // 'remove', 'history'

/*const getNavigatorLanguage = () => {
        //locale en, fr, zh, ru, pt, ko, it, nl, de, da, zh_tw, pl, es
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0]
    } else {
        return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'
    }
  }
*/

export default class draftWysiwyg extends Component{

     state={
         
        editorState: this.props.openDialogExt
            ? EditorState.createWithContent( convertFromRaw( this.props.postToEdit.body ) )// Edit post
            : this.props.isFromPanel
                ? EditorState.createWithContent( convertFromRaw( this.props.panelPostBodyRaw ) )// Show on panel
                : EditorState.createEmpty() // Create post
     }

    //START MAX LENGTH CODE

    getLengthOfSelectedText = () => {
        const currentSelection = this.state.editorState.getSelection()
        const isCollapsed = currentSelection.isCollapsed()

        let length = 0

        if (!isCollapsed) {
            const currentContent = this.state.editorState.getCurrentContent()
            const startKey = currentSelection.getStartKey()
            const endKey = currentSelection.getEndKey()
            const startBlock = currentContent.getBlockForKey(startKey)
            const isStartAndEndBlockAreTheSame = startKey === endKey
            const startBlockTextLength = startBlock.getLength()
            const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset()
            const endSelectedTextLength = currentSelection.getEndOffset()
            const keyAfterEnd = currentContent.getKeyAfter(endKey)
            console.log(currentSelection)
            if (isStartAndEndBlockAreTheSame) {
                length += currentSelection.getEndOffset() - currentSelection.getStartOffset()
            } else {
                let currentKey = startKey;

                while (currentKey && currentKey !== keyAfterEnd) {
                    if (currentKey === startKey) {
                        length += startSelectedTextLength + 1
                    } else if (currentKey === endKey) {
                        length += endSelectedTextLength
                    } else {
                        length += currentContent.getBlockForKey(currentKey).getLength() + 1
                    }

                    currentKey = currentContent.getKeyAfter(currentKey)
                }
            }
        }

        return length
    }

    handleBeforeInput = () => {
        const currentContent = this.state.editorState.getCurrentContent()
        const currentContentLength = currentContent.getPlainText('').length
        const selectedTextLength = this.getLengthOfSelectedText()

        if (currentContentLength - selectedTextLength > MAX_LENGTH - 1) {
            this.props.openSnack('warning', 'You have reached the limit of allowed characters.')

            return 'handled'
        }
    }

    handlePastedText = pastedText => {
        const currentContent = this.state.editorState.getCurrentContent()
        const currentContentLength = currentContent.getPlainText('').length
        const selectedTextLength = this.getLengthOfSelectedText()

        if (currentContentLength + pastedText.length - selectedTextLength > MAX_LENGTH) {
            this.props.openSnack('warning', 'You have reached the limit of allowed characters.')

            return 'handled'
        }
    }

     onEditorStateChange = editorState => {

        this.setState({ editorState })
        
        let currentState = editorState.getCurrentContent()
        
        if ( currentState.hasText() ) {
            !this.props.isFromPanel && this.props.getDraft( convertToRaw( currentState ) )
        }
      }

    render(){

        const { editorState } = this.state
        const { isFromPanel } = this.props

        return(
            <Editor
                editorState={editorState}
                readOnly={isFromPanel}
                toolbarHidden={isFromPanel}

                placeholder="Body..."

                wrapperClassName="rb-wrapper"
                //editorClassName="demo-editor"
                //toolbarClassName="toolbar-class"

                /*localization={{
                    locale: getNavigatorLanguage()// coming in as 'en-US' not 'en'
                }}*/
                //onFocus={() => {}}
                //onBlur={() => {}}
                toolbar={{
                    //embedded:{ defaultSize: {width:100%, height:100%}},
                    options: options,
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    //history: { inDropdown: true },
                }}
                spellCheck={true}
                handleBeforeInput={this.handleBeforeInput}
                handlePastedText={this.handlePastedText}
                //onContentStateChange={this.onContentStateChange}
                onEditorStateChange={this.onEditorStateChange}
          />
        )
    }
}