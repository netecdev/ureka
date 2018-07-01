import React from 'react'
import 'reset-css'
import { Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Link from 'gatsby-link'

export default ({children}) => (
  <div>
    <Menu>
    <Menu.Item as={Link} to={'/'}>
      Ureka
    </Menu.Item>
    <Menu.Item as={Link} to='/projects' activeClassName='active'>
      Project overview
    </Menu.Item>
    <Menu.Item as={Link} to='/project' activeClassName='active'>
      Project example
    </Menu.Item>
    </Menu>
    {children()}
  </div>
)