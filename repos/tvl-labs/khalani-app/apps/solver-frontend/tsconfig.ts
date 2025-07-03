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
  exclude: ['scr/**/*.test.ts', 'scr/**/*.test.tsx', 'scr/**/*.mocks.ts'],
}
