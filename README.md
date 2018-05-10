# Apollo Client Mock

Easily mock your apollo client for testing. It uses Apollo Link Schema under the surface

## Setup

To setup Apollo mock client you need to import your schema in as well as your mock resolvers. Then you can setup your client with these two arguments which will then return a `createClient` function which you can create a mockedClient for each test. `createClient` can optionally take a new set of resolvers that can overwrite your defaults

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

const createClient = setupClient(defaultMocks, typeDefs)

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

The following example shows you can overwrite each resolver per test

```js
test('should call resolver without blowing up', () => {

  const overwriteResolvers = {
    Mutation: () => ({
      getDomainState: (_, { name }, context) => {
        return {
          name,
          state: 'Closed'
        }
      }
    })
  }

  render(
    <ApolloProvider client={createClient(overwriteResolvers)}>
      <CheckAvailabilityContainer />
    </ApolloProvider>
  )

  //the rest of your test
}
```
