// @flow

import * as React from 'react'
import styled from 'styled-components'
import { DesktopIcon, DocIcon, EditIcon, MobileIcon, TrashIcon, UploadIcon } from './Icons'
import { Action, Container, Header, P, Title } from './Content'
import { Item, ItemLink, List } from './List'
import { wrapClick } from '../utils'
import type { App } from './Screenshot'

const Link = styled.div`
  text-align: center;
  font-family: monospace;
  background-color: #ffffff;
  padding: 2em 0;
`

type Report = {|
  title: string
|}

export type Project = {|
  title: string,
  apps: { [string]: App },
  reports: { [string]: Report }
|}

export type OnUploadApplication = (project: string) => any

export type OnUploadReport = OnUploadApplication

export type OnEditApplication = (project: string, id: string) => any

export type OnEditReport = OnEditApplication

export type OnDeleteApplication = (project: string, id: string) => any

export type OnDeleteReport = OnDeleteApplication

const s: React.ComponentType<{
  onUploadApplication?: OnUploadApplication,
  onUploadReport?: OnUploadReport,
  onDeleteApplication?: OnDeleteApplication,
  onDeleteReport?: OnDeleteReport,
  onEditApplication?: OnEditApplication,
  onEditReport?: OnEditReport,
  id: string,
  children: Project
}> = styled((({onEditReport, onEditApplication, onUploadApplication, onUploadReport, onDeleteApplication, onDeleteReport, className, children: project, id}) => (
  <Container className={className}>
    <Header>
      Applications
      {
        onUploadApplication
        && (
          <Action onClick={wrapClick(() => onUploadApplication(id))}>
            <UploadIcon />
          </Action>
        )
      }
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
              {
                onEditApplication
                && (
                  <Action onClick={wrapClick(() => onEditApplication(id, i))}>
                    <EditIcon />
                  </Action>
                )
              }

              {
                onDeleteApplication
                && (
                  <Action color='red' onClick={wrapClick(() => onDeleteApplication(id, i))}>
                    <TrashIcon />
                  </Action>
                )
              }
            </ItemLink>
          </Item>
        ))}
    </List>
    <Header>
      Reports
      {
        onUploadReport
        && (
          <Action onClick={wrapClick(() => onUploadReport(id))}>
            <UploadIcon />
          </Action>
        )
      }
    </Header>
    <List>
      {
        Object
          .keys(project.reports)
          .map(i => (
            <Item key={i}>
              <ItemLink to={`/projects/${id}/reports/${i}`}>
                <DocIcon />
                <Title>
                  {project.reports[i].title}
                </Title>
                {onEditReport
                && (
                  <Action onClick={wrapClick(() => onEditReport(id, i))}>
                    <EditIcon />
                  </Action>
                )
                }
                {
                  onDeleteReport
                  && (
                    <Action color='red' onClick={wrapClick(() => onDeleteReport(id, i))}>
                      <TrashIcon />
                    </Action>
                  )
                }
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
