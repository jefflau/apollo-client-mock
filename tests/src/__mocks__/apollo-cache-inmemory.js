modules.export = {
  InMemoryCache: jest.fn(() => ({
    restore: jest.fn()
  }))
}
