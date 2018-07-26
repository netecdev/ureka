import * as React from 'react'
import styled from 'styled-components'
import { Icon } from './Icons'
import { NavLink } from 'react-router-dom'
import { Action, Title } from './Content'

export const List = styled.ul`
  padding: 1em 0;
  list-style-type: none;
`

export const EmptyItem = styled.li`
  text-align: center;
  line-height: 4em;
  color: #7f7f7f;
  font-family: "Roboto", sans-serif;
  
`

export const ItemLink = styled(NavLink)`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  color: #585858;
  text-decoration: none;
  > ${Icon} {
    flex-grow: 0;
    flex-shrink: 0;
    height: 2em;
    width: 2em;
    margin: 1em;
    fill: #585858;
  }
  > ${Title} {
    flex-grow: 1;
    flex-shrink: 1;
    padding: 1em 0;
  }
  > ${Action} { 
  padding: 1.25em;
    ${Icon} {
        height: 1.5em;
        width: 1.5em;
        display: block;
      }
  }
`

export const Item = styled.li`
  font-family: "Robot Condensed", sans-serif;
  font-weight: 400;
  border-bottom: 0.1em solid #dcdcdc;
  border-left: 0.1em solid #dcdcdc;
  border-right: 0.1em solid #dcdcdc;
  line-height: 2em;
  &:first-of-type {
    border-top: 0.1em solid #dcdcdc;  
  }
  transition: background-color 0.1s;
  :hover {
    background-color: #eaeaea;
  }
  display: flex;
`
