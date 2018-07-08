// @flow
import * as React from 'react'
import { Action, Container, Header, Title } from './Content'
import { Item, ItemLink, List } from './List'
import { AddIcon, ProjectIcon, TrashIcon } from './Icons'
import styled from 'styled-components'
import type { Project } from './Project'

const s: React.ComponentType<{children: {[string]: Project}}> = styled(({className, children}) => (
  <Container className={className}>
    <Header>
      Current projects
      <Action>
        <AddIcon />
      </Action>
    </Header>
    <List>
      {Object.keys(children).map(id => (
        <Item key={id}>
          <ItemLink to={`/projects/${id}`}>
            <ProjectIcon />
            <Title>
              {children[id].title}
            </Title>
            <Action color={'red'}>
              <TrashIcon />
            </Action>
          </ItemLink>
        </Item>
      ))}
    </List>
  </Container>
))``


export default s
