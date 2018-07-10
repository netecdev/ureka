// @flow
import * as React from 'react'
import { Action, Container, Header, Title } from './Content'
import { Item, ItemLink, List } from './List'
import { AddIcon, EditIcon, ProjectIcon, TrashIcon } from './Icons'
import styled from 'styled-components'
import type { Project } from './Project'
import { wrapClick } from '../utils'

export type OnAddProjectF = () => any
export type OnDeleteProjectF = (id: string) => any
export type OnEditProjectF = (id: string) => any

const s: React.ComponentType<{
  onAddProject?: OnAddProjectF,
  onDeleteProject?: OnDeleteProjectF,
  onEditProject?: OnEditProjectF,
  children: { [string]: Project }
}> =
  styled(({className, children, onAddProject, onDeleteProject, onEditProject}) => (
    <Container className={className}>
      <Header>
        Current projects
        {
          onAddProject
          && (
            <Action onClick={wrapClick(onAddProject)}>
              <AddIcon />
            </Action>
          )
        }
      </Header>
      <List>
        {Object.keys(children).map(id => (
          <Item key={id}>
            <ItemLink to={`/projects/${id}`}>
              <ProjectIcon />
              <Title>
                {children[id].title}
              </Title>
              {onEditProject
              && (
                <Action onClick={wrapClick(() => onEditProject(id))}>
                  <EditIcon />
                </Action>
              )
              }
              {onDeleteProject
              && (
                <Action color={'red'} onClick={wrapClick(() => onDeleteProject(id))}>
                  <TrashIcon />
                </Action>
              )}
            </ItemLink>
          </Item>
        ))}
      </List>
    </Container>
  ))``

export default s
