import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <Query
          query={gql`
            {
              hello
            }
          `}
        >
          {({ loading, data }) => {
            if (loading) return 'loading...'

            return <h1>Message: {data.hello}</h1>
          }}
        </Query>
      </div>
    )
  }
}

export default App
