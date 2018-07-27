// @flow
import KoaRouter from 'koa-router'
import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'
import compose from 'koa-compose'
import { apolloUploadKoa } from 'apollo-upload-server'
import config from 'config'
import uuid from 'uuid/v4'
import qs from 'querystring'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

const router = new KoaRouter()

export type AuthToken = {|
  accessToken: {
    token: string,
    payload: {
      sub: string
    }
  },
  idToken: {
    token: string,
    payload: {
      picture: string,
      given_name?: string,
      name: string,
      nickname: string,
      email: string
    }
  },
  isAdmin: boolean,
  scopes: string[],
  tokenType: string,
  expires: number
|}

async function fetchAccessToken (code: string): Promise<AuthToken> {
  const res = await fetch(
    `https://${config.auth0.domain}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: config.auth0.clientId,
        client_secret: config.auth0.clientSecret,
        code,
        redirect_uri: config.auth0.redirectUri
      })

    }
  )
  if (!res.ok) {
    throw new Error('Fetch failed')
  }
  const {
    access_token: accessToken,
    id_token: idToken,
    token_type: tokenType,
    expires_in: expiresIn
  } = await res.json()
  const payload = jwt.decode(accessToken)
  const idTokenPayload = jwt.decode(idToken)
  return {
    accessToken: {token: accessToken, payload},
    idToken: {token: idToken, payload: idTokenPayload},
    expires: Date.now() + (expiresIn * 1000),
    scopes: payload.scope ? payload.scope.split(' ').filter(s => s) : [],
    isAdmin: config.get('admins').indexOf(idTokenPayload.email) >= 0,
    tokenType
  }
}

router.get('/auth/login', async (ctx, next) => {
  const {domain, audience, scope, clientId, redirectUri} = config.get('auth0')
  const state = uuid()
  const responseType = 'code'
  const q = {
    audience,
    scope,
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: responseType
  }
  ctx.session.authState = state
  ctx.redirect(`https://${domain}/authorize?${qs.stringify(q)}`)
})

router.get('/auth/callback', async (ctx, next) => {
  const {code, state: newState} = ctx.request.query
  const oldState = ctx.session.authState
  ctx.session.authState = null
  if (oldState === newState) {
    try {
      const token = await fetchAccessToken(code)
      if (!token.isAdmin) {
        ctx.redirect('/')
        return
      }
      ctx.session.authToken = token
    } catch (err) {
      ctx.redirect('/')
      return
    }
  }
  ctx.redirect('/')
})

router.get('/auth/logout', async (ctx) => {
  ctx.session.authToken = null
  ctx.redirect('/')
})

export default () => compose([router.routes(), router.allowedMethods()])
