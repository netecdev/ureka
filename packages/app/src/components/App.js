// @flow
import React, { Fragment } from 'react'
import styled, { injectGlobal } from 'styled-components'
import LeftNav from './LeftNav'
import TopNav from './TopNav'
import Screenshot from './Screenshot'
import { Redirect, Route, Switch } from 'react-router'
import Projects from './Projects'
import Project from './Project'
import Report from './Report'
import Modal, { ModalActions } from './Modal'
import { FileUpload, Label, Submit, TextField } from './Form'
import Form from './Form'
import Button from './Button'

injectGlobal`
  body {
    background-color: #F5F5F5;
  }
`

const ContentView = styled.div`
  position:relative;
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
    overflow-y: auto;
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
        '1': {
          title: 'Front page',
          type: 'desktop',
          url: '/screenshot.png',
          height: 6347,
          width: 1249,
          annotations: [
            {
              type: 'design',
              x: 400,
              y: 40,
              width: 100,
              height: 240,
              description: 'Loltime 3'
            }
          ]
        },
        '2': {
          url: '/screenshot.png',
          height: 6347,
          width: 1249,
          title: 'Main view',
          type: 'mobile',
          annotations: []
        }
      },
      reports: {
        '1': {title: 'Report 1'}
      }
    }
  }
}

type ModalT =
  | {| kind: 'addProject' |}
  | {| kind: 'deleteProject', id: string |}
  | {| kind: 'editProject', id: string |}
  | {| kind: 'uploadApplication', project: string |}
  | {| kind: 'deleteApplication', id: string, project: string |}
  | {| kind: 'editApplication', id: string, project: string |}
  | {| kind: 'uploadReport', project: string |}
  | {| kind: 'deleteReport', id: string, project: string |}
  | {| kind: 'editReport', id: string, project: string |}

const AddProject = () => (
  <Fragment>
    <h1>Add project</h1>
    <p>
      Create a new project.
    </p>
    <Form>
      <Label>
        Project name
        <TextField placeholder={'Fancy project #1'} />
      </Label>
      <Submit value={'Create'} />
    </Form>
  </Fragment>
)

const EditReport = ({project, id}) => (
  <Fragment>
    <h1>Edit project</h1>
    <p>
      Update the report information.
    </p>
    <Form>
      <Label>
        Report name
        <TextField defaultValue={data.projects[project].reports[id].title} />
      </Label>
      <Submit value={'Change'} />
    </Form>
  </Fragment>
)

const EditApp = ({id, project}) => (
  <Fragment>
    <h1>Edit application</h1>
    <p>
      Update the application information.
    </p>
    <Form>
      <Label>
        Application name
        <TextField defaultValue={data.projects[project].apps[id].title} />
      </Label>
      <Submit value={'Change'} />
    </Form>
  </Fragment>
)

const EditProject = ({id}) => (
  <Fragment>
    <h1>Edit project</h1>
    <p>
      Update the base project information.
    </p>
    <Form>
      <Label>
        Project name
        <TextField defaultValue={data.projects[id].title} />
      </Label>
      <Submit value={'Change'} />
    </Form>
  </Fragment>
)

const DeleteProject = ({id}) => (
  <Fragment>
    <h1>Delete project</h1>
    <p>
      Are you sure that you want to delete project <i>{data.projects[id].title}</i>? When deleted the project can not
      be restored.
    </p>
    <ModalActions>
      <Button positive>
        Yes
      </Button>
      <Button negative>
        No
      </Button>
    </ModalActions>
  </Fragment>
)

const DeleteApp = ({id, project}) => (
  <Fragment>
    <h1>Delete application</h1>
    <p>
      Are you sure that you want to delete application <i>{data.projects[project].apps[id].title}</i>? When deleted the
      project can not
      be restored.
    </p>
    <ModalActions>
      <Button positive>
        Yes
      </Button>
      <Button negative>
        No
      </Button>
    </ModalActions>
  </Fragment>
)

const DeleteReport = ({id, project}) => (
  <Fragment>
    <h1>Delete report</h1>
    <p>
      Are you sure that you want to delete report <i>{data.projects[project].reports[id].title}</i>? When deleted the
      project can not
      be restored.
    </p>
    <ModalActions>
      <Button positive>
        Yes
      </Button>
      <Button negative>
        No
      </Button>
    </ModalActions>
  </Fragment>
)

const UploadApp = ({project}) => (
  <Fragment>
    <h1>
      Upload application
    </h1>
    <p>
      Upload a new application!
    </p>
    <Form>
      <Label>
        Name
        <TextField placeholder={'Fancy application'} />
      </Label>
      <FileUpload />
      <Submit value={'Upload'} />
    </Form>
  </Fragment>
)

const UploadReport = ({project}) => (
  <Fragment>
    <h1>
      Upload report
    </h1>
    <p>
      Upload a new report!
    </p>
    <Form>
      <Label>
        Name
        <TextField placeholder={'Fancy report'} />
      </Label>
      <FileUpload />
      <Submit value={'Upload'} />
    </Form>
  </Fragment>
)

export default class App extends React.Component<{}, {| modal: ?ModalT |}> {
  state = {modal: null}

  onAddProject = () => this.setState({modal: {kind: 'addProject'}})
  onUploadApplication = (project: string) => this.setState({modal: {kind: 'uploadApplication', project}})
  onUploadReport = (project: string) => this.setState({modal: {kind: 'uploadReport', project}})
  onDeleteApplication = (project: string, id: string) => this.setState({
    modal: {
      kind: 'deleteApplication',
      id,
      project
    }
  })
  onDeleteReport = (project: string, id: string) => this.setState({modal: {kind: 'deleteReport', id, project}})
  onDeleteProject = (id: string) => this.setState({modal: {kind: 'deleteProject', id}})
  onEditApplication = (project: string, id: string) => this.setState({modal: {kind: 'editApplication', id, project}})
  onEditReport = (project: string, id: string) => this.setState({modal: {kind: 'editReport', id, project}})
  onEditProject = (id: string) => this.setState({modal: {kind: 'editProject', id}})
  onClose = () => this.setState({modal: null})

  _renderModal (modal: ModalT) {
    switch (modal.kind) {
      case 'addProject':
        return (
          <AddProject />
        )
      case 'editProject':
        return (
          <EditProject id={modal.id} />
        )
      case 'deleteProject':
        return (
          <DeleteProject id={modal.id} />
        )
      case 'deleteReport':
        return (
          <DeleteReport project={modal.project} id={modal.id} />
        )
      case 'deleteApplication':
        return (
          <DeleteApp project={modal.project} id={modal.id} />
        )
      case 'editApplication':
        return (
          <EditApp id={modal.id} project={modal.project} />
        )
      case 'editReport':
        return (
          <EditReport id={modal.id} project={modal.project} />
        )
      case 'uploadApplication':
        return (
          <UploadApp project={modal.project} />
        )
      case 'uploadReport':
        return (
          <UploadReport project={modal.project} />
        )
      default:
        return (
          <Fragment>
            <h1>Unsupported kind: {modal.kind}</h1>
            <ModalActions>

            </ModalActions>
          </Fragment>
        )
    }
  }

  render () {
    return (
      <Fragment>
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
              <Route path={'/projects/:project/reports/:report'} render={({match: {params: {project, report}}}) => {
                console.log(report)
                return (
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
                )
              }} />
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
                <Route path={'/projects/:project/apps/:app'} render={({match: {params: {project, app}}}) => (
                  <Screenshot app={data.projects[project].apps[app]} />
                )} />
                <Route path={'/projects/:project/reports/:report'} component={Report} />
                <Route path={'/projects/:project'} render={({match: {params: {project}}}) => (
                  <Project
                    id={project}
                    onDeleteApplication={this.onDeleteApplication}
                    onDeleteReport={this.onDeleteReport}
                    onUploadApplication={this.onUploadApplication}
                    onUploadReport={this.onUploadReport}
                    onEditApplication={this.onEditApplication}
                    onEditReport={this.onEditReport}
                  >
                    {data.projects[project]}
                  </Project>
                )} />
                <Route path={'/projects'} render={() => (
                  <Projects
                    onEditProject={this.onEditProject}
                    onAddProject={this.onAddProject}
                    onDeleteProject={this.onDeleteProject}>
                    {data.projects}
                  </Projects>
                )} />
                <Redirect from={'/'} to={'/projects'} exact />
              </Switch>
            </ContentView>
          </Content>
        </Container>
        {this.state.modal && (
          <Modal onClose={this.onClose}>
            {this._renderModal(this.state.modal)}
          </Modal>
        )}
      </Fragment>
    )
  }
}
