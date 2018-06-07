const { ApolloClient } = require('apollo-client')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { SchemaLink } = require('apollo-link-schema')
const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require('graphql-tools')
const merge = require('lodash/merge')

function setupClient({ defaultMockResolvers = {}, makeExecutableSchemaOptions, inMemoryCacheOptions }) {
  return function createClient(overwriteMocks = {}) {

    const mergedMocks = merge({ ...defaultMockResolvers }, overwriteMocks)

    const schema = makeExecutableSchema(makeExecutableSchemaOptions)

    addMockFunctionsToSchema({
      schema,
      mocks: mergedMocks
    })

    const apolloCache = new InMemoryCache(inMemoryCacheOptions).restore(
      window.__APOLLO_STATE__
    )

    const graphqlClient = new ApolloClient({
      cache: apolloCache,
      link: new SchemaLink({ schema })
    })

    return graphqlClient
  }
}

module.exports = setupClient
