// @flow
import KoaRouter from 'koa-router'
import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'
import compose from 'koa-compose'
import { apolloUploadKoa } from 'apollo-upload-server'

const router = new KoaRouter()

const types = {
  png: 'image/png',
  jpg: 'image/jpgeg'
}

router.get('/files/:fileId', async (ctx, next) => {
  const file = await ctx.db.fileByPublicId(ctx.params.fileId)
  if (!file) return next()
  const b = Buffer.from(file.data)
  if (file.kind === 'pdf') {
    ctx.response.type = 'application/pdf'
  } else {
    ctx.response.type = types[file.type]
  }
  ctx.response.length = file.data.buffer.byteLength
  ctx.response.body = file.data.buffer
})

export default () => compose([router.routes(), router.allowedMethods()])
