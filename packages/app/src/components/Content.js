import styled from 'styled-components'
import { Icon } from './Icons'

function convertColor (color) {
  switch (color) {
    case 'red':
      return '#ff2749'
    default:
    case 'blue':
      return '#4a89ff'
  }
}

export const Title = styled.div``

export const Action = styled.div`
  cursor: pointer;
  ${Icon} {
    fill: #585858;
    transition: 0.1s fill;
  }
  :hover ${Icon} {
    fill: ${({color}) => convertColor(color)};
  }
`

export const Container = styled.div`
  padding: 0 2em;
`

export const Header = styled.h2`
  font-family: "Robot Condensed", sans-serif;
  margin: 0;
  font-weight: 400;
  font-size: 1.5em;
  padding-top: 1em;
  color: #696969;
  ${Action} {
    height: 1em;
    width: 1em;
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.75em;
    ${Icon} {
      height: 1em;
      width: 1em;
    }
  
  }
`

export const P = styled.p`
  font-family: "Roboto", sans-serif;
  color: #696969;
  max-width: 40em;
  padding: 1em 0 2em;
  line-height: 1.5em;
`
