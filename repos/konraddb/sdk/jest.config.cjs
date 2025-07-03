/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./'],
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['node_modules'],
  moduleNameMapper: {
    '@store/(.*)': '<rootDir>/src/store/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@constants/(.*)': '<rootDir>/src/constants/$1',
    '@artifacts/(.*)': '<rootDir>/src/artifacts/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@config': '<rootDir>/src/config.ts',
  },
}
