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

const app = new Koa()

app.use(serve(path.join('dist', 'client'), {maxage: 1000 * 60 * 60 * 24})) // Cache 1d
app.use(serve('public', {maxage: 1000 * 60 * 60 * 24 * 7})) // Cache 1w
app.use(cors())
app.use(koaBody())
app.use(graphql())
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
