// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Button from './Button'
import { CloseIcon } from './Icons'
import KeyGrapper from './KeyGrapper'

const Container = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.5);
`

const PopUp = styled.div`
  background-color: #fff;
  box-shadow: 0 0 1em #4a4a4a;
  position: absolute;
  top: 10vh;
  left: 50%;
  width: 40em;
  margin-left: -20em;
  color: #696969;
  min-height: 4em;
  z-index: 1002;
  ${CloseIcon} {
    cursor: pointer;
    position: absolute;
    top: 1em;
    right: 1em;
    height: 1em;
    width: 1em;
    fill: #212121;
  }
`
export const ModalActions = styled.div`
  ${Button} + ${Button} {
    margin-left: 1em;
  }
`

const PopupContent = styled.div`
  padding: 1em 2em;
  h1 {
    margin: 0;
    padding-top: 0.5em;
    font-size: 2em;
    font-family: "Roboto Condensed", sans-serif;
    font-weight: 400;
  }
  font-family: Roboto, sans-serif;
  p + p{
    padding-top: 2em;
  }
`

const ClickCatcher = styled.div`
  position: absolute;
  z-index: 1001;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`


export default class Modal extends React.Component<{| children: *, onClose?: () => any |}, { mounted: boolean }> {
  el: ?HTMLDivElement
  state = {mounted: false}

  componentDidMount () {
    const modalRoot = document.querySelector('#modal-root')
    if (!modalRoot) {
      return
    }
    this.el = document.createElement('div')
    modalRoot.appendChild(this.el)
    this.setState({mounted: true})
  }

  componentWillUnmount () {
    if (!this.el) {
      return
    }
    this.el.remove()
  }

  render () {
    if (!this.el) {
      return null
    }
    return ReactDOM.createPortal(
      (
        <Container>
          <KeyGrapper code={'Escape'} on={this.props.onClose}/>
          <PopUp>
            <CloseIcon onClick={this.props.onClose}/>
            <PopupContent>
              {this.props.children}
            </PopupContent>
          </PopUp>
          <ClickCatcher onClick={this.props.onClose} />
        </Container>
      ),
      this.el
    )
  }
}

