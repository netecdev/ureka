import React from 'react'
import Link from 'gatsby-link'
import {Container, Header, List} from 'semantic-ui-react'

const SecondPage = () => (
  <Container>
    <Header>Projects</Header>
    <List celled relaxed>
      <List.Item>
        <List.Content>
          <List.Header>
            <Link to="/project">Projet name</Link>
          </List.Header>
          <List.Description>Some fancy project description.</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            <Link to="/project">Projet name</Link>
          </List.Header>
          <List.Description>Some fancy project description.</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            <Link to="/project">Projet name</Link>
          </List.Header>
          <List.Description>Some fancy project description.</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            <Link to="/project">Projet name</Link>
          </List.Header>
          <List.Description>Some fancy project description.</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            <Link to="/project">Projet name</Link>
          </List.Header>
          <List.Description>Some fancy project description.</List.Description>
        </List.Content>
      </List.Item>
    </List>
  </Container>
)

export default SecondPage
