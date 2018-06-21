
test('try', () => {
  const mockMakeExecutableSchema = jest.fn()
  const mockAddMockFunctionsToSchema = jest.fn()
  const mockInMemoryCache = jest.fn(() => ({
    restore: jest.fn()
  }))
  const mockApolloClient = jest.fn()

  jest.mock('graphql-tools', () => ({
    makeExecutableSchema: mockMakeExecutableSchema,
    addMockFunctionsToSchema: mockAddMockFunctionsToSchema
  }))
  jest.mock('apollo-cache-inmemory', () => ({
    InMemoryCache: mockInMemoryCache
  }))
  jest.mock('apollo-client', () => ({
    ApolloClient: mockApolloClient
  }))

  const { makeExecutableSchema } = require('graphql-tools')
  const { ApolloClient } = require('apollo-client')
  const { InMemoryCache } = require('apollo-cache-inmemory')
  const setupClient = require('../../../index')

  const makeExecutableSchemaOptions = {
    typeDefs: `
      type Query {
        hello: String
      }
    `
  }

  const inMemoryCacheOptions = {}

  const defaultMockResolvers = {
    Query: {
      hello: () => 'Hello'
    }
  }

  const createClient = setupClient({
    defaultMockResolvers,
    makeExecutableSchemaOptions,
    inMemoryCacheOptions
  })

  createClient()

  expect(makeExecutableSchema).toHaveBeenCalledWith(
    makeExecutableSchemaOptions
  )
  expect(InMemoryCache).toHaveBeenCalledWith(inMemoryCacheOptions)
})
