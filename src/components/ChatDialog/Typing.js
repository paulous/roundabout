import React from 'react'
import styled from 'styled-components'
import { typingDot, pulse } from '../Keyframes/Keyframes'

const StyledCircle = styled('div')`
    width:8px;
    height:8px;
    border-radius:4px;
    margin:5px;
    animation-fill-mode:forward;
    animation: ${typingDot} .5s linear ${ props => props.one ? 0 : props.two ? .25 : .5}s infinite alternate;
`

const typing = props => {

    const cont = {
        position:'absolute',
        bottom:'0',
        left:'10px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
    
    return (
        <div style={ cont }>
            <StyledCircle one />
            <StyledCircle two />
            <StyledCircle />
        </div>
    )
}

export default typing