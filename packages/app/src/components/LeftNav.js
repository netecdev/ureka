// @flow
import * as React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { DesktopIcon, DocIcon, Icon, MobileIcon, ProjectIcon } from './Icons'

const MenuLink = styled(NavLink)`
  padding: 0 1.25em;
  position: relative;
  display: block;
  height: 3em;
  line-height: 3em;
  color: #fff;
  text-decoration: none;
  span {
    font-size: 0.85em;
  }
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background-color: #3AEFD4;
    opacity: 0;
    transition: width 0.1s, opacity 0.1s;
  }
  &.active:before {
    opacity: 1;
    width: 0.3em;
  }
  > ${Icon} {
    fill: #ffffff;
    height: 1.7em;
    width: 1.7em;
    vertical-align: middle;
    margin-right: 1em;
  }
`

const LogoName = styled.span`
  font-family: "Unica One", sans-serif;
  color: #ffffff;
  font-size: 2em;
`
const Logo = styled(NavLink)`
  text-decoration: none;
  > svg {
    width: 1.7em;
    height: 1.7em;
    display: inline-block;
    vertical-align: middle;
  }
  
  > ${LogoName} {
    margin-left: 0.5em;
    vertical-align: middle;
  }
`
const LogoContainer = styled.div`
  height: 5.5em;
  background-color: #4C6073;
  position: relative;
  > ${Logo} {
    position: absolute;
    bottom: 1.3em;
    left: 1.25em;
  }
`

const MenuHeader = styled.b`
  padding: 0 1.25em;
  color: #768A9C;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 700;
  span {
    font-size: 0.85em;
  }
`

const Menu = styled.ul`
  list-style-type: none;
  padding: 1em 0;
  font-size: 1em;
  overflow-y: scroll;
  margin: 0;
  ::-webkit-scrollbar {
    width: 0.5em;
  }
   
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
   
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255,255, 0.2);
  }
`

const MenuItem = styled.li`
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 400;
  padding: 0.5em 0 ;
  overflow: hidden;
  > ${MenuLink} {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-decoration: none;
    color: #ffffff;
  }
`

const SubMenu = styled.ul`
  list-style-type: none;
  padding: 0;

`

type Nav = {|
  header?: string,
  menu: {| icon?: 'document' | 'mobile' | 'desktop' | 'project', title: string, to: string |}[]
|}

type Props = { children?: Nav[], className?: string }

const LeftNav = ({className, children}: Props) => (
  <nav className={className}>
    <LogoContainer>
      <Logo to={'/'}>
        <svg viewBox="0 0 214 214" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlnsXlink="http://www.w3.org/1999/xlink">
          <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Logo">
              <circle id="Mask" fill="#3AEFD4" cx="107" cy="107" r="107" />
              <g id="Group" transform="translate(25.000000, 59.000000)">
                <path
                  d="M0,116.74253 L0,0 L165,0 L165,115.533121 C145.379965,139.617451 115.486376,155 82,155 C49.0775834,155 19.6279572,140.131217 8.8817842e-15,116.74253 Z"
                  id="Combined-Shape" fill="#FFFFFF" />
                <rect id="Rectangle-2" fill="#FFCDCD" x="50" y="55" width="105" height="24" />
                <path
                  d="M14,130.617477 L14,103 L83,103 L83,154.995424 C82.6670278,154.998472 82.3336923,155 82,155 C56.1750195,155 32.4868944,145.851034 14,130.617477 Z"
                  id="Combined-Shape" fill="#95D9EA" />
                <rect id="Rectangle-3" fill="#F7DD83" x="11" y="15" width="143" height="20" />
              </g>
            </g>
          </g>
        </svg>
        <LogoName>
          ureka
        </LogoName>
      </Logo>
    </LogoContainer>
    <Menu>
      {(children || []).map((nav, i) => (
        <MenuItem key={i}>
          {nav.header &&
          (<MenuHeader>
            <span>
            {nav.header}
            </span>
          </MenuHeader>)}
          <SubMenu>
            {nav.menu.map((menu, i) => (
              <MenuItem key={i}>
                <MenuLink to={menu.to} activeClassName={'active'}>
                  {(icon => {
                    switch (icon) {
                      case 'desktop':
                        return <DesktopIcon />
                      case 'mobile':
                        return <MobileIcon />
                      case 'document':
                        return <DocIcon />
                      case 'project':
                        return <ProjectIcon />
                      default:
                        return null
                    }
                  })(menu.icon)}
                  <span>
                    {menu.title}
                  </span>
                </MenuLink>
              </MenuItem>
            ))}
          </SubMenu>
        </MenuItem>
      ))}

    </Menu>
  </nav>
)

const s: React.ComponentType<Props> = styled(LeftNav)`
  background-color: #425261;
  display: flex;
  flex-direction: column;
  > ${LogoContainer} {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 5.5em;
  }
  > ${Menu} {
    flex-grow: 1;
    flex-shrink: 1;
  }

`

export default s
