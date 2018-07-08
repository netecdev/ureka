// @flow
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`

`

const ImageContainer = styled.div`
  img {
    max-width: 100%;
    margin: auto;
    display: block;
  }
`

export default () => (
  <Container>
    <ImageContainer>
      <img src={'/screenshot.png'} />
    </ImageContainer>
  </Container>
)
