// @flow

import Db from '../db'

export default () => async (ctx: *, next: *) => {
  ctx.db = new Db()
  return next()
}
