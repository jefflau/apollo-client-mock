# Apollo Client Mock

Easily mock your apollo client for testing. It uses Apollo Link Schema under the surface

## Installation

```bash
$ npm install --save-dev apollo-client-mock
```

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
  Simulate.change(input)
  submitButton.click()
  expect(getDomainState).toHaveBeenCalledTimes(1)
})
```
