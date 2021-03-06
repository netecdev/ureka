// @flow
import * as React from 'react'
import { Action, Container, Header, Title } from './Content'
import { EmptyItem, Item, ItemLink, List } from './List'
import { AddIcon, EditIcon, ProjectIcon, TrashIcon } from './Icons'
import styled from 'styled-components'
import * as gt from '../../graphql'
import { wrapClick } from '../utils'
import { Helmet } from 'react-helmet'

export type OnAddProjectF = () => any
export type OnDeleteProjectF = (p: gt.GetProjects_projects_edges_node) => any
export type OnEditProjectF = (p: gt.GetProjects_projects_edges_node) => any

type Props = {
  className?: string,
  onAddProject?: OnAddProjectF,
  onDeleteProject?: OnDeleteProjectF,
  onEditProject?: OnEditProjectF,
  children: gt.GetProjects_projects_edges[],
  url: string,
  isAdmin: bool
}

const s: React.ComponentType<Props> =
  styled(({className, children, onAddProject, onDeleteProject, onEditProject, url, isAdmin}: Props) => (
    <Container className={className}>
      <Helmet title={'Projects'} />
      <Header>
        Current projects
        {
          (isAdmin && onAddProject)
          && (
            <Action onClick={wrapClick(onAddProject)}>
              <AddIcon />
            </Action>
          )
        }
      </Header>
      <List>
        {!children.length && (
          <EmptyItem>
            No projects created
          </EmptyItem>)}
        {children.map(({node}) => (
          <Item key={node.id}>
            <ItemLink to={`${url}/${node.id}`}>
              <ProjectIcon />
              <Title>
                {node.name}
              </Title>
              {
                (isAdmin && onEditProject)
                && (
                  <Action onClick={wrapClick(() => onEditProject(node))}>
                    <EditIcon />
                  </Action>
                )
              }
              {
                (isAdmin && onDeleteProject)
                && (
                  <Action color={'red'} onClick={wrapClick(() => onDeleteProject(node))}>
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
