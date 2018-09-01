// @flow
import * as React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Route, Switch } from 'react-router'
import type { HtmlConfig } from './Html'

const Header = styled.h1`
  margin: 0;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 400;
  color: #c5c5c5;
  transition: 0.1s, color;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
  max-width: 20em;
  height: calc(100% - 2em);
  position: relative;
  text-decoration: none;
  &.active {
    ${Header} {
      color: #039BE5;
    }
    ${Type} {
      color: #9A9A9A;
    }
  } 
`

const Avatar = styled(({className}) => (
  <div className={className} />
))`
  height: 3em;
  width: 3em;
  border-radius: 1.5em;
  background-size: cover;
  background-image: ${({accessToken}) => `url(${accessToken.idToken.payload.picture})`};
  background-position: 50% 50%;
`

const Name = styled.div`
  padding-right: 1em;
  color: #5d5d5d;
  font-family: Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  a {
    font-size: 0.8em;
    color: #3c8ac1;
  }
`

const User = styled(({accessToken, className}) => (
  <div className={className}>
    <Name>
      <div>
        {accessToken.idToken.payload.name}
      </div>
      <a href={'/auth/logout'}>
        (log out)
      </a>
    </Name>
    <Avatar accessToken={accessToken} />
  </div>
))`
  padding: 0 1em;
  height: 5.5em;
  display: flex;
  align-items: center;
`

const Crumbs = styled.div``

type Bc = {| type?: string, title: string, to: string |}
const TopNav = ({className, children, config}: { className: string, children: Bc[], config: HtmlConfig }) => {
  return (
    <div className={className}>
      <Crumbs>
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
      </Crumbs>
      {config.accessToken && <User accessToken={config.accessToken} />}
    </div>
  )
}

const s: React.ComponentType<{ children: Bc[], config: HtmlConfig }> = styled(TopNav)`
  background-color: #ffffff;
  height: 5.5em;
  display: flex;
  justify-content: space-between;
  box-shadow:0 0 0.5em 0 rgba(0,0,0,0.12);
  z-index: 900;
`
export default s
