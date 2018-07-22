// @flow

import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from '../../graphql/schema.graphqls'
import * as DB from '../db'
import type Db from '../db'
import { randomBytes } from '../utils'
import base64url from 'urlsafe-base64'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { GraphQLUpload } from 'apollo-upload-server'

export type Context = {
  db: Db
}

type Resolver<Info, Args: {}, Res> = (info: Info, args: Args, context: Context) => Res | Promise<Res>

type InterfaceResolver<T> = {|
  __resolveType: Resolver<void, {}, ?(T)>
|}

function toBuffer (s: stream$Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers = []
    s.on('data', (buffer) => {
      buffers.push(buffer)
    })
    s.on('end', () => {
      const buffer = Buffer.concat(buffers)
      resolve(buffer)
    })
    s.on('error', reject)
  })
}

type Upload = {
  stream: stream$Stream,
  filename: string,
  mimetype: string,
  encoding: string
}

type Resolvers = {|
  Pdf: {|
    url: Resolver<DB.File, {}, string>
  |},
  File: InterfaceResolver<'Image' | 'Pdf'>,
  PageInfo: {|
    hasPreviousPage: Resolver<void, {}, boolean>
  |},
  Query: {|
    projects: Resolver<void, { first: number, after?: DB.Cursor }, DB.PaginationResult<DB.Project>>,
    project: Resolver<void, { id: string }, ?DB.Project>
  |},
  Mutation: {|
    createProject: Resolver<void, { name: string }, DB.Project>,
    updateProject: Resolver<void, { id: string, name?: string }, DB.Project>,
    deleteProject: Resolver<void, { id: string }, {| deleted: number |}>,
    deleteReport: Resolver<void, { id: string }, {| deleted: number |}>,
    // createApplication: Resolver<void, { project: string, name: string, type: 'MOBILE' | 'DESKTOP', file: Promise<Upload> }, DB.Application>,
    createReport: Resolver<void, { project: string, name: string, file: Promise<Upload> }, DB.Report>,
    updateReport: Resolver<void, { id: string, name: string }, DB.Report>
  |},
  Project: {|
    id: Resolver<DB.Project, {}, string>,
    reports: Resolver<DB.Project, {}, DB.Report[]>,
    applications: Resolver<DB.Project, {}, DB.Application[]>
  |},
  Report: {|
    id: Resolver<DB.Report, {}, string>,
    document: Resolver<DB.Report, {}, DB.File>
  |},
  Cursor: GraphQLScalarType,
  Upload: GraphQLScalarType
|}

const Query = {
  async project (info, {id}, {db}) {
    return db.projectByPublicId(id)
  },
  async projects (info, {first, after}, {db}) {
    return db.projects(first, after)
  }
}

const File = {
  __resolveType (obj, context, info) {
    return null
  }
}

const PageInfo = {
  hasPreviousPage () {
    return false
  }
}


async function randomId(): Promise<string> {
  const randomness = await randomBytes(32)
  return base64url.encode(randomness)
}

const Mutation = {
  async createProject (i, {name}, {db}) {
    const publicId = await randomId()
    const id = await db.createProject({name, publicId})
    const p = await db.project(id)
    if (!p) throw new Error('Internal error!')
    return p
  },
  async createReport (i, args, {db}) {
    const {stream, mimetype} = await args.file
    if (mimetype !== 'application/pdf') {
      throw new Error('Unsupported file type.')
    }
    const project = await db.projectByPublicId(args.project)
    if (!project) {
      throw new Error('Project not found')
    }
    const data = await toBuffer(stream)
    const publicId = await randomId()
    const id = await db.createPdf({
      kind: 'pdf',
      publicId,
      data
    })
    const reportId = await db.createReport({
      name: args.name,
      document: id,
      project: project._id
    })
    const report: ?DB.Report = await db.report(reportId)
    if (!report) {
      throw new Error('Internal error')
    }
    return report
  },
  async deleteProject (i, {id}, {db}) {
    return db.deleteProjectByPublicId(id)
  },
  async deleteReport (_, {id}, {db}) {
    const i = db.id(id)
    if (!i) {
      return {deleted: 0}
    }
    const report = await db.report(i)
    if (!report) {
      return {deleted: 0}
    }
    const res = await db.deleteReport(i)
    if (res.deleted) {
      await db.deleteFile(report.document)
    }
    return res
  },
  async updateProject (_, {id, name}, {db}) {
    const p = await db.projectByPublicId(id)
    if (!p) {
      throw new Error('Project not found')
    }
    const o = {}
    if (name) {
      o.name = name
    }
    await db.updateProject(p._id, o)
    const updatedP = await db.project(p._id)
    if (!updatedP) {
      throw new Error('Internal error')
    }
    return updatedP
  },
  async updateReport (_, {id, name}, {db}) {
    const i = db.id(id)
    const report = i && await db.report(i)
    if (!report) throw new Error('Report not found')
    await db.updateReport(report._id, {name})
    const updated = await db.report(report._id)
    if (!updated) throw new Error('Internal error')
    return updated
  }
}

const Project = {
  id (project) {
    return project.publicId
  },
  applications (project, {first, after}, {db}) {
    return db.applicationsForProject(project._id)
  },
  reports (project, {first, after}, {db}) {
    return db.reportsForProject(project._id)
  }
}

const Report = {
  id (report) {
    return report._id.toString()
  },
  async document(report, {}, {db}) {
    const doc = await db.file(report.document)
    if (!doc) {
      throw new Error('Internal server error')
    }
    return doc
  }
}

const Pdf = {
  url (file) {
    return `/files/${file.publicId}`
  }
}

const resolvers: Resolvers = {
  File,
  Query,
  Pdf,
  PageInfo,
  Mutation,
  Project,
  Report,
  Upload: GraphQLUpload,
  Cursor: new GraphQLScalarType({
    name: 'Cursor',
    description: 'Odd custom scalar type',
    parseValue: v => v,
    serialize: v => v,
    parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10)
      }
      throw new Error('Invalid cursor')
    },
  }),
}

export default makeExecutableSchema({typeDefs, resolvers})
