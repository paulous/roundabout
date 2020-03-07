import React from 'react'
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Aux/Aux'
import styled, {css, keyframes} from'styled-components'


const sideDrawer = props => {

  const toggle = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`

  const CssSideDrawer = styled.div`

    position: fixed;
    width: 280px;
    max-width: 70%;
    height: 100%;
    left:0;
    top:0;
    z-index: 200;
    background-color: white;
    color: salmon;
    padding: 32px 16px;
    box-sizing: border-box;
    animation: ${toggle} .3s ease-out ${Props => !props.open ? 'reverse' : 'normal'} both;

    @media (min-width: 500px) {
      //display: none;
    }
    
  `

  return(
    <Aux>
        <Backdrop show={props.open}  clicked={props.closed} />
        <CssSideDrawer>

            <nav>
            </nav> 
        </CssSideDrawer>
    </Aux> 
  )
}

export default sideDrawer