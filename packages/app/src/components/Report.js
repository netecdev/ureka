// @flow
import React from 'react'
import styled from 'styled-components'

const NotSupported = styled.div`


`

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  font-family: Roboto, sans-serif;
  text-align: center;
  object {
    display: block;
  }
  ${NotSupported} {
    padding: 2em 0;
  }  
  p {
    padding-bottom: 1em;
  }
`

class Pdf extends React.Component<{| file: string |}, { loading: boolean }> {
  state = {loading: true}

  componentDidMount () {
    this.setState({loading: false})
  }

  render () {
    if (this.state.loading) {
      return null
    }
    return (
      <object data={this.props.file} type="application/pdf" width="100%" height="100%">
        <NotSupported>
          <p>Your browser doesn't support embedded PDF files</p>
          <p>Download the <a href={this.props.file} target={'_blank'}>report</a> and view it on your machine.</p>
        </NotSupported>
      </object>
    )
  }
}

export default () => (
  <Container>
    <Pdf file={'/pdf.pdf'} />
  </Container>
)
