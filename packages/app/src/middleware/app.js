// @flow
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import ReactDOMServer from 'react-dom/server'
import App from '../components/App'
import { Helmet } from 'react-helmet'
import config from 'config'
import Html from '../components/Html'
import { StaticRouter } from 'react-router'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import ApolloClient from 'apollo-client'
import { ApolloProvider, getDataFromTree } from 'react-apollo'

function gqlClient (accessToken: ?string) {
  const link = createHttpLink({
    uri: `${config.get('api.server.http')}/graphql`,
    headers: accessToken ? {authentication: `Bearer ${accessToken}`} : {},
    fetch
  })
  return new ApolloClient({
    ssrMode: true,
    // $FlowFixMe its ok
    link,
    cache: new InMemoryCache()
  })
}

export default () => async (ctx: *, next: *) => {
  const sheet = new ServerStyleSheet()
  const client = gqlClient()
  const context = {}
  const conf = {
    api: {
      http: config.get('api.client.http'),
      ws: config.get('api.client.ws')
    },
    accessToken: null
  }

  const app = (
    <ApolloProvider client={client}>
      <StaticRouter location={ctx.url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  )
  await getDataFromTree(app)
  const content = ReactDOMServer.renderToString(sheet.collectStyles(app))
  if (context.statusCode) {
    ctx.status = context.statusCode
  }
  if (context.url) {
    return ctx.redirect(context.url)
  }
  const initialState = client.extract()

  if (context.statusCode) {
    ctx.status = context.statusCode
  }
  if (context.url) {
    return ctx.redirect(context.url)
  }
  const staticHelmet = Helmet.renderStatic()
  const html = (
    <Html
      apolloState={initialState}
      helmet={staticHelmet}
      styles={sheet.getStyleElement()}
      content={content}
      config={conf}
      version={config.version} />
  )
  ctx.body = `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`

}
