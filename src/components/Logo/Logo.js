import React from 'react'
import styled from 'styled-components'
import { DuckIcon } from 'mdi-react'

let CssLogo = styled.div`
  height: 80%;
  display: flex;
  align-items: center;
  background: white;
  color:salmon;
  padding: 4px 8px;
  box-sizing: border-box;
  border-radius: 5px;
`
const logo = ({ className, color, size, fill }) => (
	<DuckIcon
		className={className}
		color={color}
		size={size}
		fill={fill} />
)

export default logo