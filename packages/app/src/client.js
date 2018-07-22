// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import type { HtmlConfig } from './components/Html'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { createUploadLink } from 'apollo-upload-client'

const config: HtmlConfig = window.__CONFIG__

function customFetch (uri, options) {
  if (config.accessToken) {
    options.headers.authentication = `Bearer ${config.accessToken}`
  }
  return fetch(uri, options)
}

const httpLink = createUploadLink({
  uri: `${config.api.http}/graphql`,
  fetch: customFetch
})

const wsLink = new WebSocketLink({
  uri: `${config.api.ws}/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: config.accessToken || ''
    }
  }
})

const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  ssrForceFetchDelay: 100,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
})

const root = window.document.getElementById('content')

ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  root
)
