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

const SubmitStyle = Button.withComponent(Input)

export const Submit = styled((props) => (
  <SubmitStyle {...props} type={'submit'} />
))``

export const FileUpload = styled(Input).attrs({type: 'file'})`
`

export const TextField = styled(Input).attrs(({type: 'text'}))`
  font-family: Roboto, sans-serif;
  padding: 0 0.5em;
  width: 100%;
  border: 0.05em solid #d8d8d8;
`

export const TextArea = styled.textarea`
  box-sizing: border-box;
  display: block;
  margin-top: 2em;
  font-family: Roboto, sans-serif;
  border: 0.05em solid #d8d8d8;
  width: 100%;
  min-height: 20em;
  
`

export const Label = styled.label`
  line-height: 1.5em;
  padding-top: 0.5em;
  font-weight: 700;
  color: #363636;
  display: block;
  ${Input}, ${TextArea} {
    margin-top: 0;
  }
`

export const Buttons = styled.div`
  ${Button} {
    margin-top: 2em;
  }
  
  ${Button}:not(:last-of-type) {  
    margin-right: 1em;
  }

`

export default styled.form`
`
