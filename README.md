# Apollo Client Mock

Easily mock your apollo client for testing. It uses Apollo Link Schema under the surface

## Installation

```bash
$ npm install --save-dev apollo-client-mock
```

## Setup

To setup Apollo mock client you need to import your schema in as well as your mock resolvers. Then you can setup your client with a config object which will then return a `createClient` function which you can create a mockedClient for each test. `createClient` can optionally take a new set of resolvers that can overwrite your defaults. Generally, the only two options that setupClient requires are defaultMocks and makeExecutableSchemaOptions.typeDefs. However, in some cases you may want to pass other options to your schema and cache. See the <a name="setupClientApi">section on the setupClient api</a> for more information.

```js
import typeDefs from '../link/to/schema'
import setupClient from 'apollo-mock-client'

const defaultMocks = {
  Query: () => ({
    nodes: () => []
    //...other queries
  }),
  Mutation: () => ({
    getDomainState: (_, { name }, context) => {
      return {
        name,
        state: 'Open'
      }
    }
    //...other mutations
  })
}

const makeExecutableSchemaOptions = {
  typeDefs
}

const createClient = setupClient({ defaultMocks, makeExecutableSchemaOptions })

export default createClient
```

```js
//Test file

import React from 'react'
import {
  render
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'
import createClient from '../testing-utils/mockedClient'

import CheckAvailabilityContainer from '../CheckAvailability'

afterEach(cleanup)

test('should call resolver without blowing up', () => {
  const { getByText, container } = render(
    <ApolloProvider client={createClient()}>
      <CheckAvailabilityContainer />
    </ApolloProvider>
  )

  //the rest of your test
}
```

The following example shows you can overwrite each resolver per test. This is useful if you want to setup a spy for your resolver function to ensure it has been called. This is particularly useful if your component just makes a mutation but does not actually show the result of the state change in the component.

```js
test('should call resolver without blowing up', () => {
  const getDomainState = jest.fn()
  const resolverOverwrites = {
    Mutation: () => ({
      getDomainState
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <CheckAvailabilityContainer />
    </ApolloProvider>
  )

  const submitButton = getByText('Check Availability')
  const form = container.querySelector('form')
  const input = form.querySelector('input')
  input.value = 'vitalik.eth'
  fireEvent.change(input)
  fireEvent.click(submitButton)
  expect(getDomainState).toHaveBeenCalledTimes(1)
})
```

## [setupClient API](#setupClientApi)

setupClinet takes an object with the following options

- `defaultMocks` is an object that would mirror the resolvers of queries, mutations, subscriptions, and other types that need to be mocked in your tests. See here for more information https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks.

- `makeExecutableSchemaOptions` is the same object that is passed to makeExecutableSchema inside of setupClient. Normally, typeDefs is the only property you will need to pass it. For a full list of available options see https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema.

- `inMemoryCacheOptions` is a completely optional object. It is passed to InMemoryCache inside of setupClient. Normally, you will not need to pass this option at all. For a full list of available options see https://www.apollographql.com/docs/react/advanced/caching.html#configuration.

Here is an example of passing a fragmentMatcher to the mocked ApolloClient.

```js
import setupClient from 'apollo-mock-client'
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import typeDefs from '../link/to/schema'
import introspectionQueryResultData from './fragmentTypes.json'

const defaultMocks = {
  Query: () => ({
    /* ... */
  }),
  Mutation: () => ({
    /* ... */
  })
}

const makeExecutableSchemaOptions = {
  typeDefs,
  resolverValidationOptions: {
    /**
     * Disables warning in the console about using
     * Interface / Union types without havig a resolveType resolver
     */
    requireResolversForResolveType: false
  }
}

const inMemoryCacheOptions = {
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  })
}

const createClient = setupClient({
  defaultMocks,
  makeExecutableSchemaOptions,
  inMemoryCacheOptions
})

export default createClient
```
