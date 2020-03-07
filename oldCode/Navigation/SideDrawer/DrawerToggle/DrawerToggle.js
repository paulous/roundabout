import React from 'react'
import styled from'styled-components'


const drawerToggle = props => {


let CssDrawerToggle = styled.div`

  width: 40px;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  box-sizing: border-box;
  cursor: pointer;

      @media (min-width: 499px) {
          display: none;
    }
`
let CssBar = styled.div`

  width: 90%;
  height: 3px;
  background-color: white;
`

  return(
    <CssDrawerToggle onClick={props.clicked}>
      <CssBar />
      <CssBar />
      <CssBar />
    </CssDrawerToggle>
  )
}

export default drawerToggle