// @flow
import * as React from 'react'
import styled from 'styled-components'
import Button from './Button'
import { Icon } from './Icons'

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

export const Buttons = styled.div`
  ${Button} {
    margin-top: 2em;
  }
  
  ${Button}:not(:last-of-type) {  
    margin-right: 1em;
  }

`

export const Selectable = styled(({children, radio, selected, ...props}) => <div {...props}>{radio && <input type='radio' checked={selected} readOnly/>}{children}</div> )`
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  margin: 0.5em;
  ${Icon} {
    height: 1em;
    width: 1em;
    margin-right: 0.5em;
    fill: ${({selected}) => selected ? '#10171d' : '#7a7a7a'};
  }
  input {
    margin-right: 0.5em;
  }
  background-color: ${({selected}) => selected ? '#e0e0e0' : '#fff'};
  transition: 0.1s background-color;
  border: 0.05em solid #d8d8d8;
  padding: 0.5em;
  box-sizing: content-box;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  cursor: pointer;
  box-shadow:0 0 0.5em 0 rgba(0,0,0,0.12);
`

export const FormError = styled(({children, ...props}) => (<div {...props}>{children.message}</div>))`
  overflow: hidden;
  border: 0.05em solid #f00;
  background-color: #ffe5e4;
  color: #f00;
  padding: 0.5em;
  margin-top: 1.5em;
  
`


export const Selectables = styled.div`
  margin-top: 2em;
  margin: 2em -0.5em -0.5em;
  flex-wrap: wrap;
  display: flex;
`

export const Label = styled.label`
  line-height: 1.5em;
  padding-top: 0.5em;
  font-weight: 700;
  color: #363636;
  display: block;
  ${Input}, ${TextArea}, ${Selectables} {
    margin-top: 0;
  }
`

export const FauxLabel = Label.withComponent('div')

export default styled.form`
`
