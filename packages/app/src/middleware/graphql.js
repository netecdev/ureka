// @flow
import KoaRouter from 'koa-router'
import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'
import compose from 'koa-compose'
import config from 'config'
import schema, { type Context } from '../graphql/schema'

const router = new KoaRouter()

async function ctxToContext (ctx): Promise<Context> {
  return {}
}

router.post('/graphql', async (ctx, next) => graphqlKoa({
  schema,
  context: await ctxToContext(ctx)
})(ctx, next))

router.get('/graphql', async (ctx, next) => graphqlKoa({
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
