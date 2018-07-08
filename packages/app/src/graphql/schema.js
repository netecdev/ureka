// @flow

import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from '../../graphql/schema.graphqls'

console.log(typeDefs)

export type Context = {}


const resolvers = {

}

export default makeExecutableSchema({typeDefs, resolvers})
