// @flow
import * as React from 'react'

export default class KeyGrapper extends React.Component<{| code: string, on?: () => any |}> {
  componentDidMount () {
    window.addEventListener('keydown', this._listener)
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', this._listener)
  }
  _listener = (evt: KeyboardEvent) => {
    if (!this.props.on) {
      return
    }
    if(evt.code !== this.props.code) {
      return
    }
    this.props.on()
  }
  render () {
    return null
  }
}
