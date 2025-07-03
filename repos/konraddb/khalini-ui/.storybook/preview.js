import { addDecorator, configure } from '@storybook/react';

import { ThemeProvider } from '../storybook/theme'


export const decorators = [
  (Story) => (
    <ThemeProvider>
      {Story()}
    </ThemeProvider>
  ),
];