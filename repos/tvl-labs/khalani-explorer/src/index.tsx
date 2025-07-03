import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { ThemeProvider } from './styles/theme/index'

const Index = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

ReactDOM.render(
  <Router>
    <Index />
  </Router>,
  document.querySelector('#root'),
)
