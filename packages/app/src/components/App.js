// @flow
import React, { Fragment } from 'react'
import styled, { injectGlobal } from 'styled-components'
import LeftNav from './LeftNav'
import TopNav from './TopNav'
import { Redirect, Route, Switch } from 'react-router'
import Projects from './Projects'
import Modal, { ModalActions } from './Modal'
import { FileUpload, Label, Submit, TextField } from './Form'
import Form from './Form'
import Button from './Button'
import { Mutation, type MutationFunction, Query, type QueryRenderProps } from 'react-apollo'
import * as gt from '../../graphql'
import GET_PROJECTS from '../../graphql/GetProjects.graphql'
import GET_PROJECT from '../../graphql/GetProject.graphql'
import ADD_PROJECT from '../../graphql/AddProject.graphql'
import UPDATE_PROJECT from '../../graphql/UpdateProject.graphql'
import DELETE_PROJECT from '../../graphql/DeleteProject.graphql'
import UPDATE_REPORT from '../../graphql/UpdateReport.graphql'
import UPLOAD_APP from '../../graphql/UploadApp.graphql'
import DELETE_REPORT from '../../graphql/DeleteReport.graphql'
import UPLOAD_REPORT from '../../graphql/UploadReport.graphql'
import type { DocumentNode } from 'graphql'
import Project from './Project'
import Report from './Report'
import { DesktopIcon, Icon, MobileIcon } from './Icons'

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

class AddProject extends React.Component<{ onSuccess?: (id: string) => any }, { value: string }> {
  state = {value: ''}

  render () {
    const refetch: { query: DocumentNode, variables?: {} }[] = [{query: GET_PROJECTS}]
    return (
      <Mutation mutation={ADD_PROJECT} refetchQueries={refetch}>
        {(addProject: MutationFunction<gt.AddProject, gt.AddProjectVariables>) => {
          return (
            <Fragment>
              <h1>Add project</h1>
              <p>
                Create a new project.
              </p>
              <Form onSubmit={async (e) => {
                e.preventDefault()
                if (!this.state.value) {
                  return
                }
                const res: { data?: gt.AddProject } | void = await addProject({variables: {name: this.state.value}})
                this.setState({value: ''})
                if (res && res.data) {
                  this.props.onSuccess && this.props.onSuccess(res.data.createProject.id)
                }

              }}>
                <Label>
                  Project name
                  <TextField
                    placeholder={'Fancy project #1'}
                    value={this.state.value}
                    onChange={e => this.setState({value: e.target.value})} />
                </Label>
                <Submit value={'Create'} disabled={!this.state.value} />
              </Form>
            </Fragment>
          )
        }}
      </Mutation>
    )
  }
}

/*
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
*/
class EditReport extends React.Component<{ id: string, name: string, project: string, onClose: () => any }, { value: string }> {
  state = {value: this.props.name}

  render () {
    const refetch: { query: DocumentNode, variables?: {} }[] = [{
      query: GET_PROJECT,
      variables: {id: this.props.project}
    }]
    return (
      <Mutation mutation={UPDATE_REPORT} refetchQueries={refetch}>
        {(addProject: MutationFunction<gt.UpdateReport, gt.UpdateReportVariables>) => {
          return (
            <Fragment>
              <h1>Edit report</h1>
              <p>
                Update the report information.
              </p>
              <Form onSubmit={async (e) => {
                e.preventDefault()
                if (!this.state.value) {
                  return
                }
                const res: { data?: gt.UpdateProject } | void = await addProject({
                  variables: {
                    id: this.props.id,
                    name: this.state.value
                  }
                })
                this.setState({value: ''})
                if (res && res.data) {
                  this.props.onClose()
                }

              }}>
                <Label>
                  Report name
                  <TextField
                    value={this.state.value}
                    onChange={e => this.setState({value: e.target.value})} />
                </Label>
                <Submit value={'Change'} disabled={!this.state.value} />
              </Form>
            </Fragment>
          )
        }}
      </Mutation>
    )
  }
}

class EditProject extends React.Component<{ id: string, name: string, onSuccess?: () => any }, { value: string }> {
  state = {value: this.props.name}

  render () {
    const refetch: { query: DocumentNode, variables?: {} }[] = [{query: GET_PROJECTS}]
    return (
      <Mutation mutation={UPDATE_PROJECT} refetchQueries={refetch}>
        {(addProject: MutationFunction<gt.UpdateProject, gt.UpdateProjectVariables>) => {
          return (
            <Fragment>
              <h1>Edit project</h1>
              <p>
                Update the base project information.
              </p>
              <Form onSubmit={async (e) => {
                e.preventDefault()
                if (!this.state.value) {
                  return
                }
                const res: { data?: gt.UpdateProject } | void = await addProject({
                  variables: {
                    id: this.props.id,
                    name: this.state.value
                  }
                })
                this.setState({value: ''})
                if (res && res.data) {
                  this.props.onSuccess && this.props.onSuccess()
                }

              }}>
                <Label>
                  Project name
                  <TextField
                    placeholder={'Fancy project #1'}
                    value={this.state.value}
                    onChange={e => this.setState({value: e.target.value})} />
                </Label>
                <Submit value={'Change'} disabled={!this.state.value} />
              </Form>
            </Fragment>
          )
        }}
      </Mutation>
    )
  }
}

const ps: { query: *, variables: * }[] = [
  {query: GET_PROJECTS, variables: {}}
]

const DeleteProject = ({id, name, onClose}) => (
  <Mutation
    mutation={DELETE_PROJECT}
    refetchQueries={ps}>
    {(mutate: MutationFunction<gt.DeleteProject, gt.DeleteProjectVariables>) => {
      return (
        <Fragment>
          <h1>Delete project</h1>
          <p>
            Are you sure that you want to delete project <i>{name}</i>? When deleted the project can not
            be restored.
          </p>
          <ModalActions>
            <Button positive onClick={async () => {
              await mutate({variables: {id}})
              onClose()
            }}>
              Yes
            </Button>
            <Button negative onClick={onClose}>
              No
            </Button>
          </ModalActions>
        </Fragment>
      )
    }}
  </Mutation>
)
/*
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
*/
const DeleteReport = ({id, name, onClose, project}) => (
  <Mutation
    mutation={DELETE_REPORT}
    refetchQueries={(): { query: *, variables: * }[] => ([{query: GET_PROJECT, variables: {id: project}}])}>
    {(mutate: MutationFunction<gt.DeleteReport, gt.DeleteReportVariables>) => {
      return (
        <Fragment>
          <h1>Delete report</h1>
          <p>
            Are you sure that you want to delete report <i>{name}</i>? When deleted the
            project can not
            be restored.
          </p>
          <ModalActions>
            <Button positive onClick={async () => {
              await mutate({variables: {id}})
              onClose()
            }}>
              Yes
            </Button>
            <Button negative onClick={onClose}>
              No
            </Button>
          </ModalActions>
        </Fragment>)
    }}
  </Mutation>
)

const Selectable = styled.div`
  ${Icon} {
    height: 1em;
    width: 1em;
    margin-right: 0.5em;
    fill: ${({selected}) => selected ? '#10171d' : '#7a7a7a'};
  }
  background-color: ${({selected}) => selected ? '#e0e0e0' : '#fff'};
  transition: 0.1s background-color;
  border: 0.05em solid #d8d8d8;
  padding: 0.5em;
  box-sizing: content-box;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  cursor: pointer;
`

const Selectables = styled.div`
  ${Selectable} {
  }
  display: flex;
`

const FauxLabel = styled.div`
    line-height: 1.5em;
    padding-top: 0.5em;
    font-weight: 700;
    color: #363636;
    display: block;
`

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
      <FauxLabel>
        Type
        <Selectables>
          <Selectable selected>
            <DesktopIcon />
            Desktop
          </Selectable>
          <Selectable>
            <MobileIcon />
            Mobile
          </Selectable>
        </Selectables>
      </FauxLabel>
      <FileUpload />
      <Submit value={'Upload'} />
    </Form>
  </Fragment>
)

class UploadReport extends React.Component<{ project: string, onClose: () => any }, { value: string, hasFile: boolean }> {
  state = {value: '', hasFile: false}
  _file: ?File

  render () {
    const refetch: { query: DocumentNode, variables?: {} }[] = [{
      query: GET_PROJECT,
      variables: {id: this.props.project}
    }]
    return (
      <Mutation mutation={UPLOAD_REPORT} refetchQueries={refetch}>
        {(upload: MutationFunction<gt.UploadReport, gt.UploadReportVariables>) => {
          return (
            <Fragment>
              <h1>
                Upload report
              </h1>
              <p>
                Upload a new report!
              </p>
              <Form onSubmit={async e => {
                e.preventDefault()
                await upload({variables: {file: this._file, name: this.state.value, project: this.props.project}})
                this.props.onClose()
              }}>
                <Label>
                  Name
                  <TextField
                    placeholder={'Fancy report'}
                    value={this.state.value}
                    onChange={e => this.setState({value: e.target.value})} />
                </Label>
                <FileUpload onChange={e => {
                  const file = e.target.files[0]
                  if (!file) return
                  this.setState(
                    ({value}) => ({value: value || file.name, hasFile: true}),
                    () => {
                      this._file = file
                    })
                }} />
                <Submit value={'Upload'} disabled={!this.state.value || !this.state.hasFile} />
              </Form>
            </Fragment>
          )
        }}
      </Mutation>
    )
  }
}

class ProjectsW extends React.Component<*, { sesh: number, modal: ?({ kind: 'create' } | { kind: 'update', p: gt.GetProjects_projects_edges_node } | { kind: 'delete', p: gt.GetProjects_projects_edges_node }) }> {
  state = {modal: null, sesh: 0}

  render () {
    return (
      <Query query={GET_PROJECTS} ssr variables={{first: 10}}>
        {({loading, error, data}: QueryRenderProps<gt.GetProjects, gt.GetProjectsVariables>) => {
          if (loading || error) {
            return null
          }
          const projects = (data && data.projects && data.projects.edges) || []
          return (
            <Fragment>
              <LeftNav>
                {
                  [
                    {
                      header: 'Overview',
                      menu: [
                        {
                          title: 'Projects',
                          to: this.props.match.url
                        }
                      ]
                    }
                  ]
                }
              </LeftNav>
              <Content>
                <TopNav>
                  {[
                    {
                      title: 'Projects',
                      type: '',
                      to: this.props.match.url
                    }
                  ]}
                </TopNav>
                <ContentView>
                  <Projects
                    url={this.props.match.url}
                    onDeleteProject={p => this.setState({modal: {kind: 'delete', p}})}
                    onEditProject={p => this.setState({modal: {kind: 'update', p}})}
                    onAddProject={() => this.setState({modal: {kind: 'create'}})}>
                    {projects}
                  </Projects>
                </ContentView>
              </Content>
              {this.state.modal && (
                <Modal onClose={() => this.setState({modal: null})}>
                  {this.state.modal.kind === 'create' &&
                  <AddProject onSuccess={(id) => {this.props.history.push(`${this.props.match.url}/${id}`)}} />}
                  {this.state.modal.kind === 'delete' &&
                  <DeleteProject {...this.state.modal.p} onClose={() => this.setState({modal: null})} />}
                  {this.state.modal.kind === 'update' &&
                  <EditProject {...this.state.modal.p} onSuccess={() => this.setState({modal: null})} />}
                </Modal>
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

type ProjectModal =
  | { kind: 'uploadApplication' }
  | { kind: 'uploadReport' }
  | { kind: 'deleteReport', report: gt.GetProject_project_reports }
  | { kind: 'editReport', report: gt.GetProject_project_reports }

class ProjectW extends React.Component<*, { modal: ?ProjectModal }> {
  state = {modal: null}

  render () {
    return (
      <Query query={GET_PROJECT} ssr variables={{id: this.props.match.params.project || ''}}>
        {({data, loading, error}: QueryRenderProps<gt.GetProject, gt.GetProjectVariables>) => {
          if (loading || error || !data || !data.project) return null
          const project = data.project
          return (
            <Fragment>
              <LeftNav>
                {[
                  {
                    header: 'Applications',
                    menu: project.applications.map(app => (
                      {
                        title: app.name,
                        to: `${this.props.match.url}/apps/${app.id}`
                      }
                    ))
                  },
                  {
                    header: 'Reports',
                    menu: project.reports.map(report => (
                      {
                        title: report.name,
                        to: `${this.props.match.url}/reports/${report.id}`
                      }
                    ))
                  }
                ]}
              </LeftNav>
              <Switch>
                <Route path={`${this.props.match.path}/reports/:report`} render={({match: {params, url}}) => {
                  const report = project.reports.find(({id}) => id === params.report)
                  if (!report) return null
                  return (
                    <Content>
                      <TopNav>
                        {[
                          {
                            type: 'Project',
                            title: project.name,
                            to: `${this.props.match.url}`
                          },
                          {
                            type: 'Report',
                            title: report.name,
                            to: `${url}`
                          }
                        ]}
                      </TopNav>
                      <ContentView>
                        <Report url={report.document.url} />
                      </ContentView>
                    </Content>
                  )
                }} />
                <Route render={() => (
                  <Content>
                    <TopNav>
                      {[
                        {
                          type: 'Project',
                          title: project.name,
                          to: `${this.props.match.url}`
                        }
                      ]}
                    </TopNav>
                    <ContentView>
                      <Project
                        onEditReport={report => this.setState({modal: {kind: 'editReport', report}})}
                        onDeleteReport={report => this.setState({modal: {kind: 'deleteReport', report}})}
                        onUploadReport={() => this.setState({modal: {kind: 'uploadReport'}})}
                        onUploadApplication={() => this.setState({modal: {kind: 'uploadApplication'}})}
                      >
                        {project}
                      </Project>
                    </ContentView>
                  </Content>
                )} />
              </Switch>

              {this.state.modal && (
                <Modal onClose={() => this.setState({modal: null})}>
                  {this.state.modal && this.state.modal.kind === 'uploadApplication' &&
                  <UploadApp onClose={() => this.setState({modal: null})} />}
                  {this.state.modal && this.state.modal.kind === 'uploadReport' &&
                  <UploadReport project={project.id} onClose={() => this.setState({modal: null})} />}
                  {this.state.modal && this.state.modal.kind === 'deleteReport' &&
                  <DeleteReport
                    {...this.state.modal.report} project={project.id}
                    onClose={() => this.setState({modal: null})} />}
                  {this.state.modal && this.state.modal.kind === 'editReport' &&
                  <EditReport
                    {...this.state.modal.report} project={project.id}
                    onClose={() => this.setState({modal: null})} />}
                </Modal>
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export default () => (
  <Container>
    <Switch>
      <Route path={'/projects/:project'} component={ProjectW} />
      <Route path={'/projects'} component={ProjectsW} />
      <Redirect from={'/'} to={'/projects'} />
    </Switch>
  </Container>
)
/*
class App extends React.Component<{}, {| modal: ?ModalT |}> {
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
*/
