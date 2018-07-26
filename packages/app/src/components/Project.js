// @flow

import * as React from 'react'
import styled from 'styled-components'
import { DesktopIcon, DocIcon, EditIcon, MobileIcon, TrashIcon, UploadIcon } from './Icons'
import { Action, Container, Header, P, Title } from './Content'
import { EmptyItem, Item, ItemLink, List } from './List'
import { wrapClick } from '../utils'
import * as gt from '../../graphql'

const Link = styled.div`
  text-align: center;
  font-family: monospace;
  background-color: #ffffff;
  padding: 2em 0;
`

export type OnUploadApplication = (project: gt.GetProject_project) => any

export type OnUploadReport = OnUploadApplication

export type OnEditApplication = (project: gt.GetProject_project_applications) => any

export type OnEditReport = (project: gt.GetProject_project_reports) => any

export type OnDeleteApplication = (project: gt.GetProject_project_applications) => any

export type OnDeleteReport = (project: gt.GetProject_project_reports) => any

type Ps = {
  onUploadApplication?: OnUploadApplication,
  onUploadReport?: OnUploadReport,
  onDeleteApplication?: OnDeleteApplication,
  onDeleteReport?: OnDeleteReport,
  onEditApplication?: OnEditApplication,
  onEditReport?: OnEditReport,
  children: gt.GetProject_project,
  className?: string
}

const s: React.ComponentType<Ps> = styled((({onEditReport, onEditApplication, onUploadApplication, onUploadReport, onDeleteApplication, onDeleteReport, className, children: project}: Ps) => (
  <Container className={className}>
    <Header>
      Applications
      {
        onUploadApplication
        && (
          <Action onClick={wrapClick(() => onUploadApplication(project))}>
            <UploadIcon />
          </Action>
        )
      }
    </Header>
    <List>
      {!project.applications.length && (
        <EmptyItem>
          No applications added
        </EmptyItem>)}

      {project.applications.map(node => (
        <Item key={node.id}>
          <ItemLink to={`/projects/${project.id}/apps/${node.id}`}>
            {((type) => {
              switch (type) {
                case 'MOBILE':
                  return <MobileIcon />
                case 'DESKTOP':
                  return <DesktopIcon />
                default:
                  return null
              }
            })(node.type)}
            <Title>
              {node.name}
            </Title>
            {
              onEditApplication
              && (
                <Action onClick={wrapClick(() => onEditApplication(node))}>
                  <EditIcon />
                </Action>
              )
            }

            {
              onDeleteApplication
              && (
                <Action color='red' onClick={wrapClick(() => onDeleteApplication(node))}>
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
          <Action onClick={wrapClick(() => onUploadReport(project))}>
            <UploadIcon />
          </Action>
        )
      }
    </Header>
    <List>
      {!project.reports.length && (
        <EmptyItem>
          No reports added
        </EmptyItem>)}
      {
        project
          .reports
          .map(node => (
            <Item key={node.id}>
              <ItemLink to={`/projects/${project.id}/reports/${node.id}`}>
                <DocIcon />
                <Title>
                  {node.name}
                </Title>
                {onEditReport
                && (
                  <Action onClick={wrapClick(() => onEditReport(node))}>
                    <EditIcon />
                  </Action>)}
                {
                  onDeleteReport
                  && (
                    <Action color='red' onClick={wrapClick(() => onDeleteReport(node))}>
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
      https://app.ureka.io/projects/{project.id}
    </Link>
  </Container>
)))``

export default s
