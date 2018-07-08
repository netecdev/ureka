// @flow

import * as React from 'react'
import styled from 'styled-components'
import { DesktopIcon, DocIcon, MobileIcon, TrashIcon, UploadIcon } from './Icons'
import { Action, Container, Header, P, Title } from './Content'
import { Item, ItemLink, List } from './List'

const Link = styled.div`
  text-align: center;
  font-family: monospace;
  background-color: #ffffff;
  padding: 2em 0;
`

type App = {|
  title: string,
  type: 'desktop' | 'mobile'
|}

type Report = {|
  title: string
|}

export type Project = {|
  title: string,
  apps: { [string]: App },
  reports: { [string]: Report }
|}

const s: React.ComponentType<{ children: [string, Project] }> = styled((({className, children: [id, project]}) => (
  <Container className={className}>
    <Header>
      Applications
      <Action>
        <UploadIcon />
      </Action>
    </Header>
    <List>
      {Object
        .keys(project.apps)
        .map(i => (
          <Item key={i}>
            <ItemLink to={`/projects/${id}/apps/${i}`}>
              {((type) => {
                switch (type) {
                  case 'mobile':
                    return <MobileIcon />
                  case 'desktop':
                    return <DesktopIcon />
                  default:
                    return null
                }
              })(project.apps[i].type)}
              <Title>
                {project.apps[i].title}
              </Title>
              <Action color='red'>
                <TrashIcon />
              </Action>
            </ItemLink>
          </Item>
        ))}
    </List>
    <Header>
      Reports
      <Action>
        <UploadIcon />
      </Action>
    </Header>
    <List>
      {
        Object
          .keys(project.reports)
          .map(i => (
            <Item key={i}>
              <ItemLink to={`/projects/${id}/reports/${i}`}>
                <DocIcon/>
                <Title>
                  {project.reports[i].title}
                </Title>
                <Action color='red'>
                  <TrashIcon />
                </Action>
              </ItemLink>
            </Item>
          ))
      }
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
      https://ureka.io/projects/{id}
    </Link>
  </Container>
)))``

export default s
