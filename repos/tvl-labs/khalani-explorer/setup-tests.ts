import '@testing-library/jest-dom'

const spy = jest.spyOn(console, 'error')
spy.mockImplementation(() => ({}))

jest.setTimeout(10000)
