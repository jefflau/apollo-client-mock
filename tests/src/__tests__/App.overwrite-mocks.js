import React from 'react'
import setupClient from '../../../index'
import { render, cleanup, wait } from 'react-testing-library'
import { ApolloProvider } from 'react-apollo'

import App from '../App'

const typeDefs = `
  type Query {
    hello: String
  }
`

const defaultMocks = {
  Query: () => ({
    hello: () => 'Default Message'
  })
}

const createClient = setupClient({
  defaultMocks,
  makeExecutableSchemaOptions: {
    typeDefs
  }
})

afterEach(cleanup)

test('default mocks should be preserved when after passing in overwrites', async () => {
  // See https://github.com/jefflau/apollo-client-mock/pull/1

  const overwriteMocks = {
    Query: () => ({
      hello: () => 'Overwritten Message'
    })
  }

  /**
   * Note that overwriteMocks are not being used here,
   * they are only used on the first rerender
   */
  const { getByText, rerender } = render(
    <ApolloProvider client={createClient()}>
      <App />
    </ApolloProvider>
  )

  await wait()

  expect(getByText(/Default Message/i)).toBeTruthy()

  rerender(
    <ApolloProvider client={createClient(overwriteMocks)}>
      <App />
    </ApolloProvider>
  )

  await wait()

  expect(getByText(/Overwritten Message/i)).toBeTruthy()

  rerender(
    <ApolloProvider client={createClient()}>
      <App />
    </ApolloProvider>
  )

  await wait()

  expect(getByText(/Default Message/i)).toBeTruthy()
})
