// @flow
import KoaRouter from 'koa-router'
import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'
import compose from 'koa-compose'
import config from 'config'
import schema, { type Context } from '../graphql/schema'
import { apolloUploadKoa } from 'apollo-upload-server'
import koaBody from 'koa-bodyparser'
import { verifyToken } from '../utils/auth'

const router = new KoaRouter()

async function isAuthorized (ctx): Promise<boolean> {
  const authHeader = ctx.request.header.authentication
  if (!authHeader || !/Bearer .+/.exec(authHeader)) {
    return false
  }
  const token = authHeader.substr(7).trim()
  return await verifyToken(token)
}

async function ctxToContext (ctx): Promise<Context> {

  return {
    db: ctx.db,
    authorized: await isAuthorized(ctx)
  }
}

router.post('/graphql',
  koaBody(),
  apolloUploadKoa(),
  async (ctx, next) => graphqlKoa({
    schema,
    context: await ctxToContext(ctx)
  })(ctx, next))

router.get('/graphql',
  koaBody(),
  apolloUploadKoa(),
  async (ctx, next) => graphqlKoa({
    schema,
    context: await ctxToContext(ctx)
  })(ctx, next))

// Setup the /graphiql route to show the GraphiQL UI
router.get(
  '/graphiql',
  graphiqlKoa({
    endpointURL: `${config.get('api.client.http')}/graphql`,
    subscriptionsEndpoint: `${config.get('api.client.ws')}/subscriptions`
  })
)

export default () => compose([router.routes(), router.allowedMethods()])
