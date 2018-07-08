// @flow
import React from 'react'

export type HtmlConfig = {|
  accessToken: ?string,
  api: {|
    http: string,
    ws: string
  |}
|}

export default ({apolloState, helmet, styles, content, config, version}: { apolloState: *, helmet: *, styles: *, content: string, config: HtmlConfig, version: string }) => (
  <html {...helmet.htmlAttributes.toComponent()}>
  <head>
    {helmet.title.toComponent()}
    {helmet.meta.toComponent()}
    {helmet.link.toComponent()}
    <script
      type={'application/javascript'}
      dangerouslySetInnerHTML={{__html: `window.__CONFIG__ = ${JSON.stringify(config).replace(/</g, '\\u003c')}`}} />
    <script
      type={'application/javascript'}
      dangerouslySetInnerHTML={{__html: `window.__APOLLO_STATE__= ${JSON.stringify(apolloState).replace(/</g, '\\u003c')}`}} />
    {styles}
    <script src={`/main.js?v=${version}`} async defer />
    <link href={'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css'} rel={'stylesheet'}
          type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Unica+One" rel="stylesheet" />
  </head>
  <body {...helmet.bodyAttributes.toComponent()}>
  <div id={'content'} dangerouslySetInnerHTML={{__html: content}} />
  <div id={'modal-root'} />
  </body>
  </html>
)
