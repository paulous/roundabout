import React from 'react'
import styled from'styled-components'

let CssBackdrop = styled.div`
  width:100%;
  height:100%;
  position: fixed;
  z-index: 100;
  left:0;
  top:0;
  background-color: rgba(0, 0, 0, 0.5);
`

const backdrop = props => (
  props.show ? <CssBackdrop onClick={props.clicked}></CssBackdrop> : null
)

export default backdrop