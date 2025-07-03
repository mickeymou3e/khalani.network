import React from 'react'

import { Preview } from '@storybook/react'

import { ThemeProvider } from '../storybook/theme'

export const preview: Preview = {
  decorators: [
    (Story) => {
      return <ThemeProvider>{Story()}</ThemeProvider>
    },
  ],
}

export default preview
