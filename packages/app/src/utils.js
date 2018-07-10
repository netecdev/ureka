// @flow

export const wrapClick = (f: () => any) => (evt: *) => {
  evt.preventDefault()
  f()
}
