// @flow

import * as React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { DesktopIcon, DocIcon, Icon, MobileIcon, TrashIcon, UploadIcon } from './Icons'

const Title = styled.div``

function convertColor (color) {
  switch (color) {
    case 'red':
      return '#ff2749'
    default:
    case 'blue':
      return '#4a89ff'
  }
}

const Action = styled.div`
  cursor: pointer;
  ${Icon} {
    fill: #585858;
    transition: 0.1s fill;
  }
  :hover ${Icon} {
    fill: ${({color}) => convertColor(color)};
  }
`

const List = styled.ul`
  padding: 1em 0;
  list-style-type: none;
`

const ItemLink = styled(NavLink)`
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

const Item = styled.li`
  font-family: "Robot Condensed", sans-serif;
  font-weight: 400;
  border-bottom: 0.1em solid #dcdcdc;
  line-height: 2em;
  &:first-of-type {
    border-top: 0.1em solid #dcdcdc;  
  }
  display: flex;
`

const Container = styled.div`
  padding: 0 2em;
`

const Header = styled.h2`
  font-family: "Robot Condensed", sans-serif;
  margin: 0;
  font-weight: 400;
  font-size: 1.5em;
  padding-top: 1em;
  color: #696969;
  ${Action} {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.75em;
    ${Icon} {
      height: 1em;
      width: 1em;
    }
  
  }
`

const P = styled.p`
  font-family: "Roboto", sans-serif;
  color: #696969;
  max-width: 40em;
  padding: 1em 0 2em;
  line-height: 1.5em;
`

const Link = styled.div`
  text-align: center;
  font-family: monospace;
  background-color: #ffffff;
  padding: 2em 0;
`

export default () => (
  <Container>
    <Header>
      Applications
      <Action>
        <UploadIcon />
      </Action>
    </Header>
    <List>
      <Item>
        <ItemLink to={'/'}>
          <DesktopIcon />
          <Title>
            Front page
          </Title>
          <Action color='red'>
            <TrashIcon />
          </Action>
        </ItemLink>
      </Item>
      <Item>
        <ItemLink to={'/'}>
          <MobileIcon />
          <Title>
            Main view
          </Title>
          <Action color='red'>
            <TrashIcon />
          </Action>
        </ItemLink>
      </Item>
    </List>
    <Header>
      Reports
      <Action>
        <UploadIcon />
      </Action>
    </Header>
    <List>
      <Item>
        <ItemLink to={'/'}>
          <DocIcon />
          <Title>
            Report 1
          </Title>
          <Action color='red'>
            <TrashIcon />
          </Action>
        </ItemLink>
      </Item>
    </List>
    <Header>
      Share
    </Header>
    <P>
      This project can be easily shared via link. Copy the link from the address bar or
      below and share it by third party channels, e.g. email. Notice that no authentication
      is required. This means that the project will be visible to all with access to the link.
    </P>
    <Link>
      https://ureka.io/projects/foo
    </Link>
  </Container>
)
