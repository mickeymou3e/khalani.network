
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  // setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  verbose: true,
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/', '<rootDir>/abis/', '<rootDir>/scripts/'],
  testTimeout: 1200000, // expect tests to take up to 20 minutes because subgraph indexing syncs,
}

export default config