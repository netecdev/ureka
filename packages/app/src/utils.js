// @flow
import crypto from 'crypto'

export const wrapClick = (f: () => any) => (evt: *) => {
  evt.preventDefault()
  f()
}

export function randomBytes(num: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(num, (err, buf) => {
      if (err) {
        return reject(err)
      }
      resolve(buf)
    })
  })
}
