import Feature from '@sections/Feature/Feature'
import Header from '@sections/Header/Header'
import Hero from '@sections/Hero/Hero'
import Socials from '@sections/Socials/Socials'
import { ThemeProvider } from '@styles/theme'
import React from 'react'

const App = () => (
  <ThemeProvider>
    <Header />
    <Hero />
    <Feature />
    <Socials />
  </ThemeProvider>
)

export default App
