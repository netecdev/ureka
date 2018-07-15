// @flow
import styled from 'styled-components'

const colors = {
  negative: {
    color: '#fff',
    bg: '#e25247'
  },
  positive: {
    color: '#fff',
    bg: '#57e26f'
  },
  default: {
    color: '#fff',
    bg: '#23e2d9'
  }
}

export default styled.button`
  box-sizing: border-box;
  background-color: ${({negative, positive}) => (negative && colors.negative.bg) || (positive && colors.positive.bg) || colors.default.bg};
  color: ${({negative, positive}) => (negative && colors.negative.color) || (positive && colors.positive.color) || colors.default.color};
  border: 0;
  height: 2.5rem;
  font-weight: 300;
  font-size: 0.9em;
  padding: 0 2rem;
  cursor: pointer;
  font-family: "Roboto Condensed", sans-serif;
  transition: 0.1s background;
  :disabled {
    background-color: #eaeaea;
  }
`
