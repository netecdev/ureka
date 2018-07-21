// @flow
import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import KeyGrapper from './KeyGrapper'
import { EditIcon, CheckmarkIcon, CloseIcon, Icon, AddIcon, PlusIcon } from './Icons'
import Form, { Buttons, Label, Submit, TextArea } from './Form'
import Button from './Button'

type AnnotationType = 'design' | 'functionality' | 'language' | 'usability'

type Annotation = {
  x: number,
  y: number,
  width: number,
  height: number,
  description: string,
  type: AnnotationType
}

export type App = {|
  title: string,
  width: number,
  height: number,
  type: 'desktop' | 'mobile',
  url: string,
  annotations: Annotation[]
|}
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

const Drag = styled.div`
  position: absolute;
  height: 1em;
  width: 1em;
  user-select: none;
  background-color: #f00;
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
  ${Icon} {
    fill: #fff;
    width: 1.5em;
    height: 1.5em;
    padding: 0.25em;
    cursor: pointer;
  }
  ${CheckmarkIcon} {    
    background-color: #49a046;
  }
  ${CloseIcon} {
    background-color: #970000;
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
  border: 0.05em solid #f00;
  background-color: ${({active}) => `rgba(255, 0, 0, ${active ? '0.4' : '0.2'})`};
  transition: 0.1s background;
  cursor: pointer;
  box-sizing: border-box;
  z-index: 10;
  animation: ${fadeInKf} 0.1s ease-in;
  ${EditIcon} {
    transition: 0.1s opacity;
    opacity: ${({active}) => active ? 1 : 0};
    position: absolute;
    bottom: 0;
    right: 0;
    height: 1em;
    width: 1em;
    background-color: #f00;
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
    margin-left: 0.5em;
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

  _dragStart = (e: DragEvent)=> {
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
  _save = () => {
    this.props.onSave && this.props.onSave({
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    })
  }

  _close = () => this.props.onClose && this.props.onClose()

  render () {
   return (
      <AnnotateBox
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
          <CheckmarkIcon onClick={this._save} />
          <CloseIcon onClick={this._close} />
        </AnnotateActionIcons>
      </AnnotateBox>
    )
  }
}

type AProps = {|
  open?: boolean,
  editing: ?'box' | 'text',
  canvas: Can,
  app: App,
  annotation: Annotation,
  onStopEdit?: () => any,
  onClick?: () => any,
  onEditBox?: () => any,
  onEditText?: () => any,
  onSaveText?: ({description: string, type: AnnotationType}) => any,
  onSaveBox?: (rect: Rect) => any
|}

class A extends React.Component<AProps, {description: string, type: AnnotationType}> {
  state = {
    description: this.props.annotation.description,
    type: this.props.annotation.type
  }
  _editBox = e => {
    e.stopPropagation()
    this.props.onEditBox && this.props.onEditBox()
  }
  _editText = () => {
    this.props.onEditText && this.props.onEditText()
  }
  _save = e => {
    e.preventDefault()
    this.props.onSaveText && this.props.onSaveText({description: this.state.description, type: this.state.type})
  }
  _cancel = e => {
    e.preventDefault()
    this.props.onStopEdit && this.props.onStopEdit()
  }
  _renderTextEditor () {
    return (
      <Form>
        <Label>
          Description
          <TextArea value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
        </Label>
        <Buttons>
          <Button onClick={this._save}>
            Update
          </Button>
          <Button grey onClick={this._cancel}>
            Cancel
          </Button>
        </Buttons>
      </Form>
    )
  }

  render () {
    const scale = this.props.canvas.width / this.props.app.width
    const offsetLeft = this.props.canvas.offsetLeft
    const x = this.props.annotation.x
    const y = this.props.annotation.y
    const width = this.props.annotation.width
    const height = this.props.annotation.height
    return (
      <AnnotateContainer>
        {this.props.editing === 'box'
          ? (
            <DraggerContainer
              {...{x, y, width, height, offsetLeft, scale}}
              onClose={this.props.onStopEdit}
              onSave={this.props.onSaveBox}
            />
          ) : (
            <AnnotateBox {...{x, offsetLeft, y, width, height, scale}} onClick={this.props.onClick}
                         active={this.props.open}>
              <EditIcon onClick={this._editBox} />
            </AnnotateBox>

          )}
        {this.props.open && this.props.editing !== 'box' && (
          <AnnotateLabel {...{x, y, offsetLeft, scale, width, height}}>
            {this.props.editing === 'text' ? (
              this._renderTextEditor()
            ) : (
              <p>
                {this.props.annotation.description}
                <EditIcon onClick={this._editText} />
              </p>
            )}
          </AnnotateLabel>
        )}
      </AnnotateContainer>
    )
  }
}

const ImageContainer = styled.div`
  position: relative;
  img {
    cursor: ${({adding}) => adding ? 'crosshair' : 'initial'};
    max-width: 100%;
    margin: auto;
    display: block;
  }
`

const Adder = styled.div`
  position: fixed;
  bottom: 2em;
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

class Annotator extends React.Component<{| app: App |}, {| canvas: ?Can, open: number, editing: ?{| id?: number, action: 'box' | 'text' |}, adding: boolean | {annotation: Annotation, step: number} |}> {
  state = {canvas: null, open: -1, editing: null, adding: false}
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
      .app
      .annotations
      .map((annotation, i) => (
          <A app={this.props.app}
             canvas={canvas} key={i}
             open={!this.state.adding && this.state.open === i}
             onStopEdit={() => this.setState({editing: null})}
             editing={!this.state.adding && this.state.editing && this.state.editing.id === i ? this.state.editing.action : null}
             onEditBox={() => this.setState({editing: {id: i, action: 'box'}})}
             onEditText={() => this.setState({editing: {id: i, action: 'text'}})}
             onClick={() => this.setState(({open, adding}) => ({open: adding || open === i ? -1 : i}))}
             annotation={annotation} />
        )
      )
  }

  _close = () => this.setState({open: -1})
  _add = e => {
    if (!this.state.canvas) return
    const {canvas} = this.state
    const {app} = this.props
    const scale = app.width / canvas.width
    const x = e.nativeEvent.offsetX * scale
    const y = e.nativeEvent.offsetY * scale
    const width = app.width / 10
    const height = width
    this.setState({adding: {annotation: {x, y, width, height, description: '', type: 'design'}, step: 0}})
  }

  _renderAdderRect (can: Can) {
    if (!this.state.adding || this.state.adding === true) {
      return null
    }
    return (
      <A
        open
        canvas={can}
        app={this.props.app}
        editing={ this.state.adding.step === 0 ? 'box' : 'text'}
        onSaveBox={(rect) =>  this.setState(({adding}) => adding && adding !== true ? ({adding: {step: 1, annotation: {...adding.annotation, ...rect}}}) : {})}
        onStopEdit={() => this.setState({adding: false})}
        annotation={this.state.adding.annotation} />
    )
  }

  render () {
    return (
      <React.Fragment>
        <ImageContainer adding={this.state.adding}>
          {this.state.canvas && this._renderAnnotations(this.state.canvas)}
          {this.state.canvas && this._renderAdderRect(this.state.canvas)}
          <img
            onClick={this.state.adding === true ? this._add : this._close}
            ref={(r) => {this._ref = r}}
            onLoad={this._onLoad}
            src={this.props.app.url}
          />
          <KeyGrapper code={'Escape'} on={this._close} />
        </ImageContainer>
        <Adder onClick={() => this.setState(({adding}) => adding ? {adding: false} : {adding: true})}>
          {!this.state.adding ? <PlusIcon /> : <CloseIcon />}
        </Adder>
      </React.Fragment>
    )
  }
}

export default ({app}: {| app: App |}) => (
  <Container>
    <Annotator app={app} />
  </Container>
)
