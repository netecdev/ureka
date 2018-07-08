// @flow
import * as React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Route, Switch } from 'react-router'

const Header = styled.h1`
  margin: 0;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 400;
  color: #c5c5c5;
  transition: 0.1s, color;
`

const Type = styled.div`
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 300;
  color: #bababa;
  height: 1.2em;
  text-transform: uppercase;
  font-size: 0.625em;
  transition: 0.1s, color;
`

const Divider = styled.div`
  float: left;
    width: 0.1em;
    margin-top: 1em;
    height: calc(100% - 2em);
    background-color: #dadada;
    transform: rotate(10deg);
    display: block;

`

const BreadCrumb = styled(NavLink)`
  float: left;
  display: block;
  padding: 1em 2em;
  height: calc(100% - 2em);
  position: relative;
  text-decoration: none;
  &.active {
    ${Header} {
      color: #05C5AD;
    }
    ${Type} {
      color: #9A9A9A;
    }
  } 
`
type Bc = {| type?: string, title: string, to: string |}
const TopNav = ({className, children}: { className: string, children: Bc[] }) => (
  <div className={className}>
    {children.map((b, i) => (
      <React.Fragment key={i}>
        {i ? <Divider /> : null}
        <BreadCrumb to={b.to} exact activeClassName={'active'}>
          <Type>
            {b.type}
          </Type>
          <Header>
            {b.title}
          </Header>
        </BreadCrumb>
      </React.Fragment>
    ))}
  </div>
)

const s: React.ComponentType<{ children: Bc[] }> = styled(TopNav)`
  background-color: #ffffff;
  height: 5.5em;
  
`
export default s
