import { Container } from '@mui/material'
import Main from '@sections/main'
import { ThemeProvider } from '@styles/theme'
import React from 'react'

const App = () => (
  <ThemeProvider>
    <Container maxWidth="xl">
      <Main />
    </Container>
  </ThemeProvider>
)

export default App
