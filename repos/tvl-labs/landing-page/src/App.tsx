import Header from '@sections/Header/Header'
import Hero from '@sections/Hero/Hero'
import { ThemeProvider } from '@styles/theme'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useEffect } from 'react'

const WhitepaperRedirect = () => {
  useEffect(() => {
    window.location.href = '/aip_whitepaper.pdf'
  }, [])

  return null
}

const App = () => (
  <Router basename="/">
    <Routes>
      <Route
        path="/"
        element={
          <ThemeProvider>
            <Header />
            <Hero />
          </ThemeProvider>
        }
      />
      <Route path="/aip_whitepaper" element={<WhitepaperRedirect />} />
    </Routes>
  </Router>
)

export default App
