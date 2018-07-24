// @flow
import * as mongo from 'mongodb'
import config from 'config'

type I = (db: mongo.Db, tableName: string) => Promise<any>

export type Project = {|
  _id: mongo.ObjectID,
  name: string,
  publicId: string,
  created: Date
|}

export type ApplicationType =
  | 'MOBILE'
  | 'DESKTOP'

export type Application = {|
  _id: mongo.ObjectID,
  name: string,
  type: ApplicationType,
  project: mongo.ObjectID,
  created: Date
|}

export type Report = {|
  _id: mongo.ObjectID,
  name: string,
  project: mongo.ObjectID,
  created: Date
|}

export type AnnotationType =
  | 'design'
  | 'functionality'
  | 'language'
  | 'usability'

export type Annotation = {|
  _id: mongo.ObjectID,
  x: number,
  y: number,
  width: number,
  height: number,
  description: string,
  type: AnnotationType,
  application: mongo.ObjectID,
  created: Date
|}

export type PageInfo = {|
  hasNextPage: bool,
  totalCount: number
|}

export type Cursor = number

type Image = {|
  _id: mongo.ObjectID,
  kind: 'image',
  type: 'png' | 'jpg',
  height: number,
  width: number,
  created: Date,
  data: Buffer,
  publicId: string,
  application: mongo.ObjectID,
  project: mongo.ObjectID
|}

type Pdf = {|
  _id: mongo.ObjectID,
  kind: 'pdf',
  created: Date,
  data: Buffer,
  publicId: string,
  report: mongo.ObjectID,
  project: mongo.ObjectID
|}

export type File =
  | Image
  | Pdf

// eslint-disable-next-line no-unused-vars
type CollectionInitiator<V> = Array<I>
const collectionDefinitions: {|
  projects: CollectionInitiator<Project>,
  applications: CollectionInitiator<Application>,
  reports: CollectionInitiator<Report>,
  files: CollectionInitiator<File>,
  annotations: CollectionInitiator<Annotation>,
|} = {
  projects: [
    async (db, n) => {
      const col = await db.createCollection(n)
      await col.createIndex({
        publicId: 1
      })
      await col.createIndex({
        report: 1
      })
      await col.createIndex({
        project: 1
      })
      await col.createIndex({
        application: 1
      })
    }
  ],
  applications: [
    (db, n) => db.createCollection(n)
  ],
  reports: [
    (db, n) => db.createCollection(n)
  ],
  files: [
    async (db, n) => {
      const col = await db.createCollection(n)
      col.createIndex({
        publicId: 1
      })
    }
  ],
  annotations: [
    (db, n) => db.createCollection(n)
  ]
}

async function connectDb () {
  try {
    return await mongo.MongoClient.connect(config.get('mongo.url'), {useNewUrlParser: true, poolSize: 100})
  } catch (err) {
    console.warn('Failed to connect to db. Retrying.', err)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return connectDb()
  }
}

const clientP = connectDb()

export default class Db {
  _dbP: Promise<mongo.Db>
  _collectionsP: Promise<$ObjMap<typeof collectionDefinitions, <V>(CollectionInitiator<V>) => mongo.Collection<V>>>

  id (id: string | number): ?mongo.ObjectID {
    try {
      return new mongo.ObjectID(id)
    } catch (_) {
      return null
    }
  }

  constructor (db?: string) {
    this._dbP = clientP.then(client => client.db(db))
    this._collectionsP = this._init()
  }

  async _init (): Promise<*> {
    const db = await this._dbP
    const collections = await db.collections()
    const collectionSet = new Set(collections.map(c => c.collectionName))

    const expandedDefinitions: { i: I, table: string }[] =
      Object
        .keys(collectionDefinitions)
        .reduce(
          (acc, key) => (
            [
              ...acc,
              ...(
                collectionDefinitions[key]
                  .reduce((acc, i: I, index: number) => ([...acc, {table: `${key}-v${index}`, i}]), [])
              )
            ]),
          [])
    await expandedDefinitions
      .filter(({table}) => !collectionSet.has(table))
      .reduce(
        async (acc, {i, table}) => {
          await acc
          await i(db, table)
        },
        Promise.resolve())
    return (
      {
        projects: db.collection(`projects-v${collectionDefinitions.projects.length - 1}`),
        applications: db.collection(`applications-v${collectionDefinitions.applications.length - 1}`),
        reports: db.collection(`reports-v${collectionDefinitions.reports.length - 1}`),
        files: db.collection(`files-v${collectionDefinitions.files.length - 1}`),
        annotations: db.collection(`annotations-v${collectionDefinitions.annotations.length - 1}`),
      })
  }

  async _paginateQuery<T> (f: mongo.Cursor<T>, first: number, after?: number = -1): Promise<PaginationResult<T>> {
    const [projects, totalCount] = await Promise.all([
      f.skip(after + 1).limit(first).toArray(),
      f.count()
    ])
    const edges = projects
      .map((p, i) => ({node: p, cursor: i + after}))
    return {
      edges,
      pageInfo: {
        totalCount,
        hasNextPage: first + after < totalCount
      }
    }
  }

  async projects (first: number, after?: Cursor): Promise<PaginationResult<Project>> {
    const f = (await this._collectionsP)
      .projects
      .find()
      .sort('created', -1)
    return this._paginateQuery(f, first, after)
  }

  async project (id: mongo.ObjectID): Promise<?Project> {
    return (await this._collectionsP)
      .projects
      .findOne({_id: id})
  }

  async report (id: mongo.ObjectID): Promise<?Report> {
    return (await this._collectionsP)
      .reports
      .findOne({_id: id})
  }

  async application (id: mongo.ObjectID): Promise<?Application> {
    return (await this._collectionsP)
      .applications
      .findOne({_id: id})
  }

  async file (id: mongo.ObjectID): Promise<?File> {
    return (await this._collectionsP)
      .files
      .findOne({_id: id})
  }

  async fileByReport (report: mongo.ObjectID): Promise<?File> {
    return (await this._collectionsP)
      .files
      .findOne({report})
  }

  async fileByApp (application: mongo.ObjectID): Promise<?File> {
    return (await this._collectionsP)
      .files
      .findOne({application})
  }

  async fileByPublicId (id: string): Promise<?File> {
    return (await this._collectionsP)
      .files
      .findOne({publicId: id})

  }

  async createProject (o: WithoutId<Project>): Promise<mongo.ObjectID> {
    const {insertedId} = await (await this._collectionsP).projects.insertOne({...o, created: new Date()})
    return insertedId
  }

  async createPdf (o: WithoutId<Pdf>): Promise<mongo.ObjectID> {
    const {insertedId} = await (await this._collectionsP).files.insertOne({...o, created: new Date()})
    return insertedId
  }

  async createImage (o: WithoutId<Image>): Promise<mongo.ObjectID> {
    const {insertedId} = await (await this._collectionsP).files.insertOne({...o, created: new Date()})
    return insertedId
  }

  async createReport (o: WithoutId<Report>): Promise<mongo.ObjectID> {
    const {insertedId} = await (await this._collectionsP).reports.insertOne({...o, created: new Date()})
    return insertedId
  }

  async createApp (o: WithoutId<Application>): Promise<mongo.ObjectID> {
    const {insertedId} = await (await this._collectionsP).applications.insertOne({...o, created: new Date()})
    return insertedId
  }

  async projectByPublicId (publicId: string): Promise<?Project> {
    return (await this._collectionsP)
      .projects
      .findOne({publicId})
  }

  async applicationByProjectAndId (project: mongo.ObjectID, id: mongo.ObjectID): Promise<?Application> {
    return (await this._collectionsP)
      .applications
      .findOne({
        project,
        _id: id
      })
  }

  async deleteProject (id: mongo.ObjectID): Promise<{| deleted: number |}> {
    const {deletedCount} = await (await this._collectionsP)
      .projects
      .deleteOne({_id: id})
    return {deleted: deletedCount}
  }

  async deleteReport (id: mongo.ObjectID): Promise<{| deleted: number |}> {
    const {deletedCount} = await (await this._collectionsP)
      .reports
      .deleteOne({_id: id})
    return {deleted: deletedCount}
  }

  async deleteApplication (id: mongo.ObjectID): Promise<{| deleted: number |}> {
    const {deletedCount} = await (await this._collectionsP)
      .applications
      .deleteOne({_id: id})
    return {deleted: deletedCount}
  }

  async deleteReportByProject (project: mongo.ObjectID): Promise<{| deleted: number |}> {
    const {deletedCount} = await (await this._collectionsP)
      .reports
      .deleteMany({project})
    return {deleted: deletedCount}
  }

  async updateProject (id: mongo.ObjectID, o: $Shape<Project>): Promise<{| modified: number |}> {
    const {modifiedCount} = await (await this._collectionsP)
      .projects
      .updateOne(
        {_id: id},
        {
          $set: o
        }
      )
    return {modified: modifiedCount}
  }

  async updateReport (id: mongo.ObjectID, o: $Shape<Report>): Promise<{| modified: number |}> {
    const {modifiedCount} = await (await this._collectionsP)
      .reports
      .updateOne(
        {_id: id},
        {
          $set: o
        }
      )
    return {modified: modifiedCount}
  }
  async updateApplication (id: mongo.ObjectID, o: $Shape<Application>): Promise<{| modified: number |}> {
    const {modifiedCount} = await (await this._collectionsP)
      .applications
      .updateOne(
        {_id: id},
        {
          $set: o
        }
      )
    return {modified: modifiedCount}
  }

  async deleteFileByReport (report: mongo.ObjectID) {
    const {deletedCount} = await (await this._collectionsP)
      .files
      .deleteMany({report})
    return {deleted: deletedCount}
  }

  async deleteFileByApplication (application: mongo.ObjectID) {
    const {deletedCount} = await (await this._collectionsP)
      .files
      .deleteMany({application})
    return {deleted: deletedCount}
  }

  async deleteFileByProject (project: mongo.ObjectID) {
    const {deletedCount} = await (await this._collectionsP)
      .files
      .deleteMany({project})
    return {deleted: deletedCount}
  }

  async applicationsForProject (project: mongo.ObjectID): Promise<Application[]> {
    return (await this._collectionsP)
      .applications
      .find({project})
      .sort('created', 1)
      .toArray()

  }

  async reportsForProject (project: mongo.ObjectID): Promise<Report[]> {
    return (await this._collectionsP)
      .reports
      .find({project})
      .sort('created', 1)
      .toArray()
  }
}

export type PaginationResult<R> = {| edges: {| node: R, cursor: Cursor |}[], pageInfo: PageInfo |}

export type WithoutId<V> = $Diff<V, { _id: mongo.ObjectID, created: Date }>
