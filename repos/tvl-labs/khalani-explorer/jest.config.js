module.exports = {
  roots: ['./'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
  },
  testRegex: `(/__tests__/.*|(\\.|/)(saga.test|spec|network.test|component.test))\\.[jt]sx?$`,
  transformIgnorePatterns: ['node_modules/(?!@tvl-labs/khalani-ui)'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '\\.png$': '<rootDir>/__mocks__/svgrMock.js',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@containers/(.*)': '<rootDir>/src/containers/$1',
    '@constants/(.*)': '<rootDir>/src/constants/$1',
    '@enums/(.*)': '<rootDir>/src/enums/$1',
    '@pages/(.*)': '<rootDir>/src/pages/$1',
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
  coveragePathIgnorePatterns: ['<rootDir>/public/', '<rootDir>/testUtils/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
}
