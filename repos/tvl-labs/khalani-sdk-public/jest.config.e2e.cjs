/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./'],
  moduleFileExtensions: ['ts', 'js', 'e2e'],
  testPathIgnorePatterns: ['node_modules', 'dist', 'e2e'],
  workerThreads: true,
  testMatch: ['**/*.e2e.test.ts'],
  moduleNameMapper: {
    '@store/(.*)': '<rootDir>/src/store/$1',
    '@classes/(.*)': '<rootDir>/src/classes/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@constants/(.*)': '<rootDir>/src/constants/$1',
    '@artifacts/(.*)': '<rootDir>/src/artifacts/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@enums/(.*)': '<rootDir>/src/enums/$1',
    '@dataSource/(.*)': '<rootDir>/src/dataSource/$1',
    '@graph/(.*)': '<rootDir>/src/graph/$1',
    '@config': '<rootDir>/src/config.ts',
    '@intents': '<rootDir>/src/intents/$1',
  },
}
