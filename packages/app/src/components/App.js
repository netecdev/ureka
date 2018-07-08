// @flow
import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import LeftNav from './LeftNav'
import TopNav from './TopNav'
import Screenshot from './Screenshot'
import { Redirect, Route, Switch } from 'react-router'
import Projects from './Projects'
import Project from './Project'
import Report from './Report'

injectGlobal`
  body {
    background-color: #F5F5F5;
  }
`

const ContentView = styled.div`

`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  
  > ${TopNav} {
    flex-grow: 0;
    flex-shrink: 0;
  }
  > ${ContentView} {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-y: scroll;
  }
`

const Container = styled.div`
  display: flex;
  height: 100vh;

  > ${LeftNav} {
    flex-basis: 16em;
    flex-grow: 0;
    flex-shrink: 0;
  }
`

const data = {
  projects: {
    foo: {
      title: 'Foo',
      apps: {
        '1': {title: 'Front page', type: 'desktop'},
        '2': {title: 'Main view', type: 'mobile'}
      },
      reports: {
        '1': {title: 'Report 1'}
      }
    }
  }
}

export default () => (
  <Container>
    <Switch>
      <Route path='/projects/:project' render={({match: {params: {project}}}) => (
        <LeftNav>
          {[{
            header: 'Applications',
            menu:
              Object
                .keys(data.projects[project].apps)
                .map(id => ({
                  title: data.projects[project].apps[id].title,
                  to: `/projects/${project}/apps/${id}`,
                  icon: data.projects[project].apps[id].type
                }))
          },
            {
              header: 'Reports',
              menu:
                Object
                  .keys(data.projects[project].reports)
                  .map(id => ({
                    title: data.projects[project].reports[id].title,
                    to: `/projects/${project}/reports/${id}`,
                    icon: 'document'
                  }))
            }
          ]}
        </LeftNav>
      )} />
      <Route path={'/projects'} render={() => (
        <LeftNav>
          {[{
            header: 'Projects',
            menu:
              Object
                .keys(data.projects)
                .map(id => ({
                  title: data.projects[id].title,
                  to: `/projects/${id}`,
                  icon: 'project'
                }))
          }]}
        </LeftNav>
      )} />
      <Route render={() => (
        <LeftNav>
          {[]}
        </LeftNav>
      )} />
    </Switch>
    <Content>
      <Switch>
        <Route path={'/projects/:project/apps/:app'} render={({match: {params: {project, app}}}) => (
          <TopNav>
            {[
              {
                title: data.projects[project].title,
                type: 'Project',
                to: `/projects/${project}`
              },
              {
                title: data.projects[project].apps[app].title,
                type: 'Application',
                to: `/projects/${project}/apps/${app}`
              }
            ]}
          </TopNav>
        )} />
        <Route path={'/projects/:project/reports/:report'} render={({match: {params: {project, report}}}) => (
          <TopNav>
            {[
              {
                title: data.projects[project].title,
                type: 'Project',
                to: `/projects/${project}`
              },
              {
                title: data.projects[project].reports[report].title,
                type: 'Report',
                to: `/projects/${project}/reports/${report}`
              }
            ]}
          </TopNav>
        )} />
        <Route path={'/projects/:project'} render={({match: {params: {project}}}) => (
          <TopNav>
            {[
              {
                title: data.projects[project].title,
                type: 'Project',
                to: `/projects/${project}`
              }
            ]}
          </TopNav>
        )} />
        <Route path={'/projects'} render={() => (
          <TopNav>
            {[
              {
                title: 'Projects',
                type: '',
                to: `/projects`
              }
            ]}
          </TopNav>
        )} />
      </Switch>
      <ContentView>
        <Switch>
          <Route path={'/projects/:project/apps/:app'} component={Screenshot} />
          <Route path={'/projects/:project/reports/:report'} component={Report} />
          <Route path={'/projects/:project'} component={Project} />
          <Route path={'/projects'} component={Projects} />
          <Redirect from={'/'} to={'/projects'} exact />
        </Switch>
      </ContentView>
    </Content>
  </Container>
)
