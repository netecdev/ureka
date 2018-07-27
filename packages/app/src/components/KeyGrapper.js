// @flow
import * as React from 'react'

export default class KeyGrapper extends React.Component<{| code: string, on?: (n: number) => any |}> {
  _last = 0
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
    const on = this.props.on
    if(evt.code !== this.props.code) {
      return
    }
    const now = Date.now()
    on(now - this._last)
    this._last = now
  }
  render () {
    return null
  }
}
