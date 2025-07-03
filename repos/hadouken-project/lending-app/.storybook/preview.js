import { ThemeProvider } from '../src/styles/theme'


export const decorators = [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ];


