import { keyframes } from 'styled-components'

export const pulse = keyframes`
  0% {
    opacity:100;
  }
  100% {
    opacity:0;
  }
  `

export const typingDot = keyframes`
  0% {
    background-color: lightgray;
  }
  100% {
    background-color: white;
    }
  `