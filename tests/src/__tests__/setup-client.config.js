import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

test('ensure defaultMockResolvers, overwriteMocks, makeExecutableSchemaOptions, and inMemoryCacheOptions are being passed into their appropriate places.', () => {
  const mockMakeExecutableSchema = jest.fn()
  const mockAddMockFunctionsToSchema = jest.fn()
  const mockInMemoryCache = jest.fn(() => ({
    restore: jest.fn()
  }))
  const mockApolloClient = jest.fn()

  jest.mock('../../../node_modules/graphql-tools', () => ({
    makeExecutableSchema: mockMakeExecutableSchema,
    addMockFunctionsToSchema: mockAddMockFunctionsToSchema
  }))
  jest.mock('../../../node_modules/apollo-cache-inmemory', () => ({
    InMemoryCache: mockInMemoryCache
  }))
  jest.mock('../../../node_modules/apollo-client', () => ({
    ApolloClient: mockApolloClient
  }))

  const setupClient = require('../../../index')

  const makeExecutableSchemaOptions = {
    typeDefs: `
      type Query {
        hello: String
        unionType: UnionType
      }

      union UnionType = UnionTypeOne | UnionTypeTwo

      type UnionTypeOne {
        id: ID!
        typeOneField: String
      }

      type UnionTypeTwo {
        id: ID!
        typeTwoField: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello World'
      },
      UnionType: {
        __resolveType: obj => {
          if (obj.typeOneField) {
            return 'UnionTypeOne'
          }

          if (obj.typeTwoField) {
            return 'UnionTypeTwo'
          }

          return null
        }
      }
    },
    logger: { log: e => console.log(e) },
    allowUndefinedInResolve: false,
    resolverValidationOptions: {
      requireResolversForArgs: false,
      requireResolversForNonScalar: false,
      requireResolversForAllFields: false,
      requireResolversForResolveType: true,
      allowResolversNotInSchema: false
    },
    schemaDirectives: {},
    parseOptions: {},
    inheritResolversFromInterfaces: false
  }

  const inMemoryCacheOptions = {
    addTypename: true,
    dataIdFromObject: () => {},
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [
            {
              kind: 'UNION',
              name: 'UnionType',
              possibleTypes: [
                { name: 'UnionTypeOne' },
                { name: 'UnionTypeTwo' }
              ]
            }
          ]
        }
      }
    }),
    cacheRedirects: {
      Query: {
        hello: () => 'Hello Cache'
      }
    }
  }

  const defaultMockResolvers = {
    Query: {
      hello: () => 'Hello Saturn'
    }
  }

  const createClient = setupClient({
    defaultMockResolvers,
    makeExecutableSchemaOptions,
    inMemoryCacheOptions
  })

  const overwriteMocks = {
    Query: {
      hello: () => 'Hello Jupiter'
    },
    UnionType: {
      __resolveType: () => 'UnionTypeOne'
    }
  }

  createClient(overwriteMocks)

  expect(mockMakeExecutableSchema).toHaveBeenCalledWith(
    makeExecutableSchemaOptions
  )
  expect(mockAddMockFunctionsToSchema).toHaveBeenCalledWith(
    expect.objectContaining({
      mocks: { ...defaultMockResolvers, ...overwriteMocks }
    })
  )
  expect(mockInMemoryCache).toHaveBeenCalledWith(inMemoryCacheOptions)
})
