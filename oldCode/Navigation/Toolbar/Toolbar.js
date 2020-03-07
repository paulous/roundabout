import React from 'react'
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle'
import Logo from '../../Logo/Logo'
import styled from'styled-components'

const toolbar = props => {

  const CssHeader = styled.div`

    height: 50px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: salmon;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    z-index: 90;
  ` 

  return(
    <CssHeader>
      <DrawerToggle clicked={props.drawerToggledClicked} />
        <Logo />
    </CssHeader>
  )
}

export default toolbar

