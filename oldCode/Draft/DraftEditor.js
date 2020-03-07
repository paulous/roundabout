import React from 'react'
import { EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import './draftEditor.css'

import createEmojiPlugin from 'draft-js-emoji-plugin'
import emojiStyles from './emojiStyles.css'

import createLinkifyPlugin from 'draft-js-linkify-plugin'
import 'draft-js-linkify-plugin/lib/plugin.css'

import createVideoPlugin from 'draft-js-video-plugin';
import VideoAdd from './VideoAdd'

const emojiPlugin = createEmojiPlugin()
const { EmojiSuggestions, EmojiSelect } = emojiPlugin

const linkifyPlugin = createLinkifyPlugin({ target: '_blank', rel:'noopener' })

const videoPlugin = createVideoPlugin()


const plugins = [emojiPlugin, linkifyPlugin, videoPlugin]


const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    },
}

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote'
        default: return null
    }
}

class StyleButton extends React.PureComponent {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault()
            this.props.onToggle(this.props.style)
        }
    }

    render() {
        let className = 'RichEditor-styleButton'
        if (this.props.active) {
            className += ' RichEditor-activeButton'
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        )
    }
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' }
]

const BlockStyleControls = (props) => {
    const { editorState } = props
    const selection = editorState.getSelection()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType()

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle()
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    )
}

const MAX_LENGTH = 300

class draftEditor extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = { 
            editorState: props.openDialogExt !== undefined
                ? EditorState.createWithContent( convertFromRaw( props.postToEdit.body ) ) // Edit post
                : props.isFromPanel !== undefined
                    ? EditorState.createWithContent( convertFromRaw( props.panelPostBodyRaw ) ) // Show on panel
                    : EditorState.createEmpty() // Create post
            }

        this.focus = () => this.editor.focus()

        this.handleKeyCommand = this._handleKeyCommand.bind(this)
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this)
        this.toggleBlockType = this._toggleBlockType.bind(this)
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this)

    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }

    _mapKeyToEditorCommand(e) {
        switch (e.keyCode) {
            case 9: // TAB
                const newEditorState = RichUtils.onTab(
                    e,
                    this.state.editorState,
                    4, /* maxDepth */
                )
                if (newEditorState !== this.state.editorState) {
                    this.onChange(newEditorState)
                }
                return
        }
        return getDefaultKeyBinding(e)
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        )
    }

    //START MAX LENGTH CODE

    _getLengthOfSelectedText = () => {
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

        return length;
    }

    _handleBeforeInput = () => {
        const currentContent = this.state.editorState.getCurrentContent()
        const currentContentLength = currentContent.getPlainText('').length
        const selectedTextLength = this._getLengthOfSelectedText()

        if (currentContentLength - selectedTextLength > MAX_LENGTH - 1) {
            this.props.openSnack('warning', 'You have reached the limit of allowed characters.')

            return 'handled'
        }
    }

    _handlePastedText = pastedText => {
        const currentContent = this.state.editorState.getCurrentContent()
        const currentContentLength = currentContent.getPlainText('').length
        const selectedTextLength = this._getLengthOfSelectedText()

        if (currentContentLength + pastedText.length - selectedTextLength > MAX_LENGTH) {
            this.props.openSnack('warning', 'You have reached the limit of allowed characters.')

            return 'handled'
        }
    }

    onChange = editorState => {

        this.setState({ editorState })

        let contentState = editorState.getCurrentContent()

        if ( contentState.hasText() ) {
            this.props.isFromPanel === undefined && this.props.getDraft( convertToRaw( editorState.getCurrentContent() ) )
        }
    }

    render() {

        const { editorState } = this.state

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor'
        var contentState = editorState.getCurrentContent()

        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder'
            }
        }

        return (
            <div className="RichEditor-root">
                {  this.props.isFromPanel === undefined &&
                    <React.Fragment>
                        <div style={{display:'flex', paddingBottom:'5px'}}>
                            <EmojiSuggestions />
                            <div className={emojiStyles.options}>
                                <EmojiSelect />
                            </div>
                            <VideoAdd
                                editorState={editorState}
                                onChange={this.onChange}
                                modifier={videoPlugin.addVideo}
                            />
                        </div>
                        <BlockStyleControls
                            editorState={editorState}
                            onToggle={this.toggleBlockType}
                        />
                        <InlineStyleControls
                            editorState={editorState}
                            onToggle={this.toggleInlineStyle}
                        />
                    </React.Fragment>
                }
                <div className={className} onClick={this.focus}>
                    <Editor
                        readOnly={this.props.isFromPanel}
                        editorState={editorState}
                        onChange={this.onChange}
                        placeholder="Write your post here..."
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.mapKeyToEditorCommand}
                        ref={(ref) => this.editor = ref}
                        spellCheck={true}
                        handleBeforeInput={this._handleBeforeInput}
                        handlePastedText={this._handlePastedText}
                        plugins={plugins}
                    />
                </div>
            </div>
        )
    }
}

export default draftEditor