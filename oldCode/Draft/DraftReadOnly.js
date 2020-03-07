import React from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import './draftEditor.css'

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote'
        default: return null
    }
}

let editorState = EditorState 

const onChange = raw => es => {
    editorState.createWithContent( convertFromRaw( raw ) )
}

const emojiPlugin = createEmojiPlugin()
//const { EmojiSuggestions, EmojiSelect } = emojiPlugin
const plugins = [emojiPlugin]

const draftReadOnly = props => {

    //!editorState.getCurrentContent && editorState.createWithContent( convertFromRaw( props.panelPostBodyRaw ) )

    //const raw = convertToRaw(editorState.getCurrentContent())
    //console.log(JSON.stringify(raw))
    
    return (
        <React.Fragment>
            <Editor
                readOnly={true}
                editorState={editorState}
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                plugins={plugins}
                onChange={onChange(props.panelPostBodyRaw)}
            />
        </React.Fragment>
    )
}

export default draftReadOnly