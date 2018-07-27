// @flow
import Koa from 'koa'
import config from 'config'
import serve from 'koa-static'
import path from 'path'
import appM from './middleware/app'
import graphql from './middleware/graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import type { Context } from './graphql/schema'
import { execute, subscribe } from 'graphql'
import schema from './graphql/schema'
import cors from '@koa/cors'
import koaBody from 'koa-bodyparser'
import Db from './db'
import files from './middleware/files'
import db from './middleware/db'
import auth from './middleware/auth'
import session from 'koa-session'
import { RedisStore } from './utils/store'

const app = new Koa()
app.keys = [config.get('key')]

app.use(serve(path.join('dist', 'client'), {maxage: 1000 * 60 * 60 * 24})) // Cache 1d
app.use(serve('public', {maxage: 1000 * 60 * 60 * 24 * 7})) // Cache 1w
app.use(cors())
app.use(koaBody())
app.use(session({
  key: 'ureka:sesh',
  maxAge: 86400000,
  store: new RedisStore()
}, app))
app.use(db())
app.use(graphql())
app.use(auth())
app.use(files())
app.use(appM())

const port = config.get('port')

const server = app.listen(port, () => {
  console.log(`Listening on port ${port} - version ${config.version}`)
})

async function onConnect (connectionParams): Promise<Context> {
  return {
    db: new Db()
  }
}

new SubscriptionServer({
  execute,
  subscribe,
  onConnect,
  schema
}, {
  path: '/subscriptions',
  server
})
