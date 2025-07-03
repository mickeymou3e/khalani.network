import { resolve } from 'path'

import sharedConfig from '../../tsconfig.paths.json'

export default {
  extends: resolve(__dirname, '../../tsconfig.json'),
  compilerOptions: {
    baseUrl: './',
    paths: {
      ...sharedConfig.paths,
    },
  },
  include: ['src/**/*'],
  exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.mocks.ts'],
}
