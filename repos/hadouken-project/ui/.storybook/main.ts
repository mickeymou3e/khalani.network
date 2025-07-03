import { mergeConfig } from 'vite'

import type { StorybookConfig } from '@storybook/react-vite'

const path = require('path')
const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    autodocs: 'tag',
  },
  addons: ['@storybook/addon-essentials'],

  viteFinal: async (config) => {
    const rootPath = path.join(__dirname, '../')

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@components': path.resolve(rootPath, 'src/components/'),
          '@interfaces': path.resolve(rootPath, 'src/interfaces/'),
          '@styles': path.resolve(rootPath, 'src/styles/'),
          '@tests': path.resolve(rootPath, 'testUtils/'),
          '@utils': path.resolve(rootPath, 'src/utils/'),
        },
      },
    })
  },
}

export default config
