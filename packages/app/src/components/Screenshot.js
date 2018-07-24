// @flow
import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import KeyGrapper from './KeyGrapper'
import { EditIcon, CheckmarkIcon, CloseIcon, Icon, PlusIcon } from './Icons'
import Form, { Buttons, FauxLabel, Label, Selectable, Selectables, TextArea } from './Form'
import Button from './Button'
import ReactMarkdown from 'react-markdown'
import * as gt from '../../graphql'
import { Query, type QueryRenderProps, Mutation, type MutationFunction } from 'react-apollo'
import GET_APPLICATION from '../../graphql/GetApplication.graphql'
import ADD_ANNOTATION from '../../graphql/AddAnnotation.graphql'
import UPDATE_ANNOTATION from '../../graphql/UpdateAnnotation.graphql'

const Container = styled.div`

`

type Can = {|
  width: number,
  offsetLeft: number
|}

const fadeInKf = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
`

const fadeInAndDownKf = keyframes`
  0% {
    margin-top: -0.5em;
    opacity: 0;
  }
  100% {
    margin-top: 0;
    opacity: 100%;
  }
`

const annotateColors = {
  DESIGN: {
    foreground: '#f00',
    background: 'rgba(255, 0, 0, 0.3)',
    activeBackground: 'rgba(255, 0, 0, 0.5)'
  },
  FUNCTIONALITY: {
    foreground: '#ff0',
    background: 'rgba(255, 255, 0, 0.3)',
    activeBackground: 'rgba(255, 255, 0, 0.5)'
  },
  USABILITY: {
    foreground: '#f0f',
    background: 'rgba(255, 0, 255, 0.3)',
    activeBackground: 'rgba(255, 0, 255, 0.5)'
  },
  LANGUAGE: {
    foreground: '#0ff',
    background: 'rgba(0, 255, 255, 0.3)',
    activeBackground: 'rgba(0, 255, 255, 0.5)'
  }
}

const Drag = styled.div`
  position: absolute;
  height: 1em;
  width: 1em;
  user-select: none;
  z-index: 200;

`

const DragUL = styled(Drag)`
  top: 0;
  left: 0;
`
const DragLR = styled(Drag)`
  bottom: 0;
  right: 0;
`
const InvisibleDrag = styled(Drag)`
  background-color: transparent;
  z-index: 201;
  cursor: move;
`

const InvisibleDragUL = styled(InvisibleDrag)`
  top: 0;
  left: 0;
`

const InvisibleDragLR = styled(InvisibleDrag)`
  bottom: 0;
  right: 0;
`

const AnnotateActionIcons = styled.div`
  display: flex;
  justify-content: space-between;

`
const Action = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  height: 1em;
  width: 1em;
  border-radius: 1em;
  background-color: ${({red}) => red ? '#c63a3a' : '#0fab0a'};
  padding: 0.5em;
  ${Icon} {
    fill: #fff;
    width: 1em;
    height: 1em;
    cursor: pointer;
  }
`

const AnnotateBox = styled.div.attrs({
  style: ({x, y, width, height, scale, offsetLeft, manual}) => {
    if (manual) {
      return {}
    }
    return ({
      top: y * scale,
      left: x * scale + offsetLeft,
      width: width * scale,
      height: height * scale
    })
  }
})`
  position: absolute;
  user-select: none;
  border: 0.05em solid ${({type}) => annotateColors[type].foreground};
  background-color: ${({type, active}) => active ? annotateColors[type].activeBackground : annotateColors[type].background};
  transition: 0.1s background;
  cursor: pointer;
  box-sizing: border-box;
  z-index: ${({active}) => active ? 11 : 10};
  animation: ${fadeInKf} 0.1s ease-in;
  ${Drag} {
    background-color: ${({type}) => annotateColors[type].foreground};
  }
  ${EditIcon} {
    transition: 0.1s opacity;
    opacity: ${({active}) => active ? 1 : 0};
    position: absolute;
    bottom: 0;
    right: 0;
    height: 1em;
    width: 1em;
    background-color: ${({type}) => annotateColors[type].foreground};
    fill: #fff;
  }
  ${AnnotateActionIcons} {
    position: absolute;
    top: calc(100% + 1em);
    left: 50%;
    width: 5em;
    margin-left: -2.5em;
  }
`

const AnnotateLabel = styled.div`
  position: absolute;
  top: calc(${({y, height, scale}) => (y + height) * scale}px + 1em);
  left: ${({x, width, scale, offsetLeft}) => offsetLeft + (((x + (width / 2)) * scale))}px;
  margin-left: -15em;
  background-color: #fff;
  font-family: Roboto, sans-serif;
  padding: 1em 2em;
  z-index: 11;
  box-shadow: 0 0 0.5em #595959;
  width: 30em;
  box-sizing: border-box;
  p {
    font-size: 0.9em;
    line-height: 1.5em;
    text-align: justify;
  }
  ${EditIcon} {
    height: 1em;
    width: 1em;
    float: right;
    fill: #ff00b4;
  }
  animation: ${fadeInAndDownKf} 0.1s ease-in;
`

const AnnotateContainer = styled.div`
  ${EditIcon} {
    cursor: pointer;
  }
`

type Pos = {| x: number, y: number |}

type Rect = {| ...Pos, width: number, height: number |}

class Dragger extends React.Component<{| scale: number, children: React.Element<typeof InvisibleDrag>, onDrag: (Pos) => any |}> {
  _x: number
  _y: number
  _ref: HTMLDivElement

  _dragStart = (e: DragEvent) => {
    this._x = e.clientX
    this._y = e.clientY
  }

  _drag = (e: DragEvent) => {
    this.props.onDrag({
      x: (e.clientX - this._x) * this.props.scale,
      y: (e.clientY - this._y) * this.props.scale
    })
    this._x = e.clientX
    this._y = e.clientY
  }
  _drop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  _reffer = ref => {
    this._ref = ref
  }

  componentDidMount () {
    this._ref.addEventListener('dragstart', this._dragStart, false)
    this._ref.addEventListener('drop', this._drop, false)
    this._ref.addEventListener('drag', this._drag, false)
  }

  render () {
    const child = React.Children.only(this.props.children)
    return (
      <child.type
        {...child.props}
        innerRef={this._reffer}
        draggable
      />
    )
  }
}

class DraggerContainer extends React.Component<{|
  scale: number, offsetLeft: number,
  type: gt.AnnotationType,
  x: number, y: number, width: number, height: number,
  onClose?: () => any, onSave?: (Rect) => any
|}> {

  _ref: HTMLDivElement

  _x = this.props.x
  _y = this.props.y
  _width = this.props.width
  _height = this.props.height

  componentDidMount () {
    this._updatePos()
    if (!this._ref) return
    this._ref.addEventListener('dragover', this._dragOver, false)
  }

  _updatePos () {
    this._ref.style.top = `${this._y * this.props.scale}px`
    this._ref.style.left = `${this._x * this.props.scale + this.props.offsetLeft}px`
    this._ref.style.width = `${this._width * this.props.scale}px`
    this._ref.style.height = `${this._height * this.props.scale}px`
  }

  componentDidUpdate () {
    this._updatePos()
  }

  _draggerLr = p => {
    const newWidth = this._width + p.x
    if (newWidth < 0) {
      this._width = 0
      this._x += newWidth
    } else {
      this._width = newWidth
    }
    const newHeight = this._height + p.y
    if (newHeight < 0) {
      this._height = 0
      this._y += newHeight
    } else {
      this._height = newHeight
    }
    this._updatePos()
  }
  _draggerUl = p => {
    this._x += p.x
    this._width = Math.max(0, this._width - p.x)
    this._y += p.y
    this._height = Math.max(0, this._height - p.y)
    this._updatePos()
  }

  _dragOver = (e: DragEvent) => {
    e.preventDefault()
  }
  _save = e => {
    this.props.onSave && this.props.onSave({
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    })
  }

  _close = e => {
    e.stopPropagation()
    this.props.onClose && this.props.onClose()
  }

  render () {
    return (
      <AnnotateBox
        active
        type={this.props.type}
        manual
        innerRef={r => {
          this._ref = r
        }}>
        <DragLR />
        <DragUL />
        <Dragger onDrag={this._draggerLr} scale={1 / this.props.scale}>
          <InvisibleDragLR />
        </Dragger>
        <Dragger onDrag={this._draggerUl} scale={1 / this.props.scale}>
          <InvisibleDragUL />
        </Dragger>
        <AnnotateActionIcons>
          <Action onClick={this._save}>
            <CheckmarkIcon />
          </Action>
          <Action red onClick={this._close}>
            <CloseIcon />
          </Action>
        </AnnotateActionIcons>
      </AnnotateBox>
    )
  }
}

type AProps = {|
  open?: boolean,
  new?: boolean,
  editing: ?'box' | 'text',
  canvas: Can,
  screenshot: gt.GetProject_project_applications_screenshot,
  annotation: gt.GetApplication_application_annotations,
  onStopEdit?: () => any,
  onClick?: () => any,
  onEditBox?: () => any,
  onEditText?: () => any,
  onSaveText?: ({ description: string, type: gt.AnnotationType }) => any,
  onChange?: ({ description: string, type: gt.AnnotationType }) => any,
  onSaveBox?: (rect: Rect) => any
|}

class A extends React.Component<AProps> {

  _editBox = e => {
    e.stopPropagation()
    this.props.onEditBox && this.props.onEditBox()
  }
  _editText = () => {
    this.props.onEditText && this.props.onEditText()
  }
  _save = e => {
    e.preventDefault()
    this.props.onSaveText && this.props.onSaveText({
      description: this.props.annotation.description,
      type: this.props.annotation.type
    })
  }
  _cancel = e => {
    e.preventDefault()
    this.props.onStopEdit && this.props.onStopEdit()
  }
  _changeType = type => () => this.props.onChange && this.props.onChange({
    description: this.props.annotation.description,
    type
  })

  _renderTextEditor () {
    return (
      <Form>
        <Label>
          Description
          <TextArea value={this.props.annotation.description}
                    onChange={(e) => this.props.onChange && this.props.onChange({
                      description: e.target.value,
                      type: this.props.annotation.type
                    })} />
        </Label>
        <FauxLabel>
          Type
          <Selectables>
            <Selectable
              selected={this.props.annotation.type === 'FUNCTIONALITY'}
              onClick={this._changeType('FUNCTIONALITY')}>
              Functionality
            </Selectable>
            <Selectable
              selected={this.props.annotation.type === 'DESIGN'}
              onClick={this._changeType('DESIGN')}>
              Design
            </Selectable>
            <Selectable
              selected={this.props.annotation.type === 'USABILITY'}
              onClick={this._changeType('USABILITY')}>
              Usability
            </Selectable>
            <Selectable
              selected={this.props.annotation.type === 'LANGUAGE'}
              onClick={this._changeType('LANGUAGE')}>
              Language
            </Selectable>
          </Selectables>
        </FauxLabel>
        <Buttons>
          <Button onClick={this._save}>
            {this.props.new ? 'Create' : 'Update'}
          </Button>
          <Button grey onClick={this._cancel}>
            Cancel
          </Button>
        </Buttons>
      </Form>
    )
  }

  render () {
    const scale = this.props.canvas.width / this.props.screenshot.width
    const offsetLeft = this.props.canvas.offsetLeft
    const x = this.props.annotation.x
    const y = this.props.annotation.y
    const width = this.props.annotation.width
    const height = this.props.annotation.height
    return (
      <AnnotateContainer>
        {this.props.open && this.props.editing === 'box'
          ? (
            <DraggerContainer
              {...{x, y, width, height, offsetLeft, scale}}
              type={this.props.annotation.type}
              onClose={this.props.onStopEdit}
              onSave={this.props.onSaveBox}
            />
          ) : (
            <AnnotateBox
              type={this.props.annotation.type}
              {...{x, offsetLeft, y, width, height, scale}} onClick={this.props.onClick}
              active={this.props.open}>
              <EditIcon onClick={this._editBox} />
            </AnnotateBox>

          )}
        {this.props.open && this.props.editing !== 'box' && (
          <AnnotateLabel {...{x, y, offsetLeft, scale, width, height}}>
            {this.props.editing === 'text' ? (
              this._renderTextEditor()
            ) : (
              <div>
                <ReactMarkdown source={this.props.annotation.description} />
                <EditIcon onClick={this._editText} />
              </div>
            )}
          </AnnotateLabel>
        )}
      </AnnotateContainer>
    )
  }
}

const ClickCatcher = styled.div`
  z-index: 15;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: crosshair;
`

const ImageContainer = styled.div`
  position: relative;
  img {
    max-width: 100%;
    margin: auto;
    display: block;
  }
`

const Adder = styled.div`
  user-select: none;
  position: fixed;
  bottom: 2em;
  z-index: 20;
  right: 2em;
  height: 1.5em;
  width: 1.5em;
  background-color: #25e2cc;  
  box-shadow: 0 0 1em #808080;
  border-radius: 2.75em;
  padding: 1em;
  transition: 0.1s background;
  cursor: pointer;
  :hover {
    background-color: #25ffe9;
  }
  ${Icon} {
    fill: #ffffff;
  }
`

function prettyRect (rect: Rect): Rect {
  return {
    x: Math.floor(rect.x),
    y: Math.floor(rect.y),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height)

  }
}

function prettyAnnotation (annotation: gt.GetApplication_application_annotations): gt.GetApplication_application_annotations {
  const {x, y, width, height} = annotation
  return {
    ...annotation,
    ...prettyRect({x, y, width, height})
  }
}

type CreatorAProps = {|
  app: gt.GetProject_project_applications,
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: Can,
  onClose?: () => any,
  project: string
|}
type CreatorAState = {|
  annotation: gt.GetApplication_application_annotations,
  step: 0 | 1
|}

class CreatorA extends React.Component<CreatorAProps, CreatorAState> {
  state = {
    step: 0,
    annotation:
      {
        id: '',
        description: '',
        type: 'DESIGN',
        height: this.props.height,
        width: this.props.width,
        x: this.props.x,
        y: this.props.y
      }
  }
  rf: { query: *, variables: * }[] = [{
    query: GET_APPLICATION,
    variables: {id: this.props.app.id, project: this.props.project}
  }]

  render () {
    return (
      <Mutation
        mutation={ADD_ANNOTATION}
        refetchQueries={this.rf}>
        {(f: MutationFunction<gt.AddAnnotation, gt.AddAnnotationVariables>) => {
          return (
            <A
              open
              new
              onStopEdit={() => this.props.onClose && this.props.onClose()}
              onEditText={() => this.setState({step: 1})}
              onEditBox={() => this.setState({step: 0})}
              onSaveBox={rect => this.setState(({annotation}) => ({step: 1, annotation: {...annotation, ...rect}}))}
              onChange={o => this.setState(({annotation}) => ({step: 1, annotation: {...annotation, ...o}}))}
              onSaveText={async () => {
                await f({variables: {app: this.props.app.id, ...prettyAnnotation(this.state.annotation)}})
                this.props.onClose && this.props.onClose()
              }}
              editing={this.state.step ? 'text' : 'box'}
              canvas={this.props.canvas}
              annotation={this.state.annotation}
              screenshot={this.props.app.screenshot}
            />
          )
        }}
      </Mutation>)
  }
}

type EditableAProps = {|
  app: gt.GetProject_project_applications,
  canvas: Can,
  open?: boolean,
  onClick?: () => any,
  onClose?: () => any,
  project: string,
  annotation: gt.GetApplication_application_annotations
|}
type EditableAState = {|
  editing: ?('box' | 'text'),
  annotation: ?gt.GetApplication_application_annotations
|}

class EditableA extends React.Component<EditableAProps, EditableAState> {
  state = {editing: null, annotation: null}
  _startEdit = editing => () => this.setState(({annotation}) => ({
    editing,
    annotation: annotation || this.props.annotation
  }))
  _change = update => this.setState(({annotation}) => ({annotation: {...(annotation || this.props.annotation), ...update}}))
  rf: { query: *, variables: * }[] = [{
    query: GET_APPLICATION,
    variables: {id: this.props.app.id, project: this.props.project}
  }]

  componentDidUpdate (props) {
    if (!this.props.open && props.open) {
      this.setState({editing: null, annotation: null})
    }
  }

  render () {
    return (
      <Mutation mutation={UPDATE_ANNOTATION} refetchQueries={this.rf}>
        {(f: MutationFunction<gt.UpdateAnnotation, gt.UpdateAnnotationVariables>) => {
          return (
            <A screenshot={this.props.app.screenshot}
               canvas={this.props.canvas}
               editing={this.state.editing}
               open={this.props.open}
               onEditBox={this._startEdit('box')}
               onSaveBox={async rect => {
                 await f({variables: {...prettyRect(rect), annotation: this.props.annotation.id}})
                 this.props.onClose && this.props.onClose()
               }}
               onSaveText={async text => {
                 await f({variables: {...text, annotation: this.props.annotation.id}})
                 this.props.onClose && this.props.onClose()
               }}
               onEditText={this._startEdit('text')}
               onStopEdit={() => this.setState({editing: null, annotation: null})}
               onChange={this._change}
               onClick={this.props.onClick}
               annotation={this.state.annotation || this.props.annotation} />
          )
        }}
      </Mutation>
    )
  }
}

type AnnotatorState = {|
  canvas: ?Can,
  open: ?string,
  adding: boolean | Rect
|}

type AnnotatorProps = {|
  app: gt.GetProject_project_applications,
  annotations: gt.GetApplication_application_annotations[],
  project: string,
|}

class Annotator extends React.Component<AnnotatorProps, AnnotatorState> {
  state = {canvas: null, open: null, adding: false}
  _ref: ?HTMLImageElement
  _onLoad = (evt) => {
    this._load(evt.target)
  }

  _onResize = () => {
    if (!this._ref) {
      return
    }
    this._load(this._ref)
  }

  _load (element: HTMLImageElement) {
    const width = element.clientWidth
    const offsetLeft = element.offsetLeft
    this.setState({canvas: {width, offsetLeft}})
  }

  _add = e => {
    const canvas = this.state.canvas
    if (!canvas) return
    const scale = this.props.app.screenshot.width / canvas.width
    const x = e.nativeEvent.offsetX * scale
    const y = e.nativeEvent.offsetY * scale
    const width = this.props.app.screenshot.width / 10
    const height = width
    this.setState({adding: {x, y, width, height}, open: null})
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResize)
    if (!this._ref) {
      return
    }
    if (this._ref.complete) {
      this._load(this._ref)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize)
  }

  _renderAnnotations (canvas: Can) {
    return this.props
      .annotations
      .map((annotation) => (
          <EditableA
            project={this.props.project}
            annotation={annotation}
            canvas={canvas}
            app={this.props.app}
            open={!this.state.adding && this.state.open === annotation.id}
            onClose={this._close}
            onClick={() => this.setState(({open, adding}) => ({open: adding || open === annotation.id ? null : annotation.id}))}
            key={annotation.id} />
        )
      )
  }

  _close = () => this.setState({open: null})

  _renderAdderRect (can: Can) {
    if (typeof this.state.adding === 'boolean') return null
    return (
      <CreatorA
        project={this.props.project}
        onClose={() => this.setState({adding: false})}
        app={this.props.app}
        {...this.state.adding}
        canvas={can} />
    )
  }

  render () {
    return (
      <React.Fragment>
        <ImageContainer adding={this.state.adding}>
          {this.state.canvas && this._renderAnnotations(this.state.canvas)}
          {this.state.canvas && this._renderAdderRect(this.state.canvas)}
          {this.state.adding === true && <ClickCatcher onClick={this._add} />}
          <img
            onClick={this._close}
            ref={(r) => {this._ref = r}}
            onLoad={this._onLoad}
            src={this.props.app.screenshot.url}
          />
          <KeyGrapper code={'Escape'} on={this._close} />
        </ImageContainer>
        <Adder onClick={() => this.setState(({adding}) => adding ? {adding: false, open: null} : {
          adding: true,
          open: null
        })}>
          {!this.state.adding ? <PlusIcon /> : <CloseIcon />}
        </Adder>
      </React.Fragment>
    )
  }
}

export default ({app, project}: {| app: gt.GetProject_project_applications, project: string |}) => (
  <Container>
    <Query query={GET_APPLICATION} variables={{id: app.id, project: project}}>
      {({data, error, loading}: QueryRenderProps<gt.GetApplication, gt.GetApplicationVariables>) => {
        const annotations = error || loading || !data || !data.application ? [] : data.application.annotations
        return <Annotator app={app} annotations={annotations} project={project} />
      }}
    </Query>
  </Container>
)
