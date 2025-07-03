import { configure } from '@storybook/react';

import { ThemeProvider } from '../storybook/theme'

//TO-DO: Temporary workaround for the issue with Storybook BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString()
}


export const decorators = [
  (Story) => (
    <ThemeProvider>
      {Story()}
    </ThemeProvider>
  ),
];