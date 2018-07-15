// @flow
import * as React from 'react'
import styled from 'styled-components'
import Button from './Button'

const Input = styled.input`
  height: 2.5rem;
  box-sizing: border-box;
  margin-top: 2em;
  display: block;
`

export const Label = styled.label`
  line-height: 1.5em;
  padding-top: 0.5em;
  font-weight: 700;
  color: #363636;
  display: block;
  ${Input} {
    margin-top: 0;
  }
`

const SubmitStyle = Button.withComponent(Input)

export const Submit = styled((props) => (
  <SubmitStyle {...props} type={'submit'} />
))``


export const FileUpload = styled(Input).attrs({type: 'file'})`
`

export const TextField = styled(Input).attrs(({type: 'text'}))`
  font-family: Roboto, sans-serif;
  padding: 0 0.1em;
  max-width: 20em;
  width: 100%;
`

export default styled.form`
`
