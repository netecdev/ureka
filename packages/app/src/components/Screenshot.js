// @flow
import React, { Fragment } from 'react'
import styled, { keyframes } from 'styled-components'
import KeyGrapper from './KeyGrapper'
import { EditIcon } from './Icons'

type Annotation = {
  x: number,
  y: number,
  width: number,
  height: number,
  description: string,
  type: 'design' | 'functionality' | 'language' | 'usability'
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
  height: 0.5em;
  width: 0.5em;
  background-color: #f00;

`

const DragUL = styled(Drag)`
  top: 0;
  left: 0;
`
const DragLR = styled(Drag)`
  bottom: 0;
  right: 0;
`
const AnnotateBox = styled.div`
  position: absolute;
  user-select: none;
  top: ${({y}) => y}px;
  left: ${({x}) => x}px;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  border: 0.05em solid #f00;
  background-color: ${({active}) => `rgba(255, 0, 0, ${active ? '0.4' : '0.2'})`};
  transition: 0.1s background;
  cursor: pointer;
  box-sizing: border-box;
  z-index: 10;
  animation: ${fadeInKf} 0.1s ease-in;
  ${EditIcon} {
    position: absolute;
    bottom: 0em;
    right: 0;
    height: 1em;
    width: 1em;
    background-color: #f00;
    fill: #fff;
  }
`

const AnnotateLabel = styled.div`
  position: absolute;
  top: calc(${({y, height}) => y + height}px + 1em);
  left: ${({x, width}) => x + width / 2}px;
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

class A extends React.Component<{| open?: boolean, canvas: Can, app: App, annotation: Annotation, onClick?: () => any |}> {
  render () {
    const scale = this.props.canvas.width / this.props.app.width
    const x = this.props.canvas.offsetLeft + (scale * this.props.annotation.x)
    const y = scale * this.props.annotation.y
    const width = scale * this.props.annotation.width
    const height = scale * this.props.annotation.height
    return (
      <AnnotateContainer>
        <AnnotateBox {...{x, y, width, height}} onClick={this.props.onClick} active={this.props.open}>
          <EditIcon />
        </AnnotateBox>
        {this.props.open && (
          <AnnotateLabel {...{x, y, width, height}}>
            <p>
              {this.props.annotation.description}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet volutpat mauris. Pellentesque
              habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean a efficitur urna.
              Mauris eu quam ullamcorper, tincidunt ipsum non, tincidunt mi. Etiam ultricies, nisi a faucibus venenatis,
              nulla augue scelerisque justo, vel pellentesque augue felis at mi. Duis vel consectetur elit, eu ultrices
              dui. Morbi diam velit, tincidunt gravida orci a, imperdiet porttitor ex. Nulla in nisl lectus. Morbi non
              dolor eget ante aliquam ornare et eu diam. Phasellus ac interdum augue. Duis urna turpis, posuere non
              commodo nec, placerat quis elit. Vivamus semper molestie augue, vel convallis massa maximus nec. Proin at
              metus eu diam scelerisque blandit.
              <EditIcon />
            </p>
          </AnnotateLabel>
        )}
      </AnnotateContainer>
    )
  }
}

const ImageContainer = styled.div`
  position: relative;
  img {
    max-width: 100%;
    margin: auto;
    display: block;
  }
`

class Annotator extends React.Component<{| app: App |}, {| canvas: ?Can, open: number |}> {
  state = {canvas: null, open: 0}
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
             open={this.state.open === i}
             onClick={() => this.setState(({open}) => ({open: open === i ? -1 : i}))}
             annotation={annotation} />
        )
      )
  }

  _close = () => this.setState({open: -1})

  render () {
    return (
      <ImageContainer>
        {this.state.canvas && this._renderAnnotations(this.state.canvas)}
        <img
          onClick={this._close}
          ref={(r) => {this._ref = r}}
          onLoad={this._onLoad}
          src={this.props.app.url}
        />
        <KeyGrapper code={'Escape'} on={this._close} />
      </ImageContainer>
    )
  }
}

export default ({app}: {| app: App |}) => (
  <Container>
    <Annotator app={app} />
  </Container>
)
