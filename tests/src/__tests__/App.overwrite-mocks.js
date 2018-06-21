import React from 'react'
import setupClient from '../../../index'
import {
  render,
  cleanup,
  wait
} from 'react-testing-library'
import { ApolloProvider } from 'react-apollo'

import App from '../App'

const typeDefs = `
  type Query {
    hello: String
  }
`

const defaultMockResolvers = {
  Query: () => ({
    hello: () => 'Default Message'
  })
}

const createClient = setupClient({
  defaultMockResolvers,
  makeExecutableSchemaOptions: {
    typeDefs
  }
})

afterEach(cleanup)

test('1: should display "Default Message"', async () => {
  const { getByText } = render(
    <ApolloProvider client={createClient()}>
      <App />
    </ApolloProvider>
  )

  await wait()

  expect(getByText(/Default/i)).toBeTruthy()
})

test('2: should display "Overwritten Message"', async () => {
  const overwriteMocks = {
    Query: () => ({
      hello: () => 'Overwritten Message'
    })
  }

  const { getByText } = render(
    <ApolloProvider client={createClient(overwriteMocks)}>
      <App />
    </ApolloProvider>
  )

  await wait()

  expect(getByText(/Overwritten/i)).toBeTruthy()
})

test('3: should display "Default Message" again', async () => {
  const { getByText } = render(
    <ApolloProvider client={createClient()}>
      <App />
    </ApolloProvider>
  )

  await wait()

  expect(getByText(/Default/i)).toBeTruthy()
})
