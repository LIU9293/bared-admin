import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from '@store'
import { lightTheme, ThemeProvider } from '@strapi/design-system'
import App from './app'
import './index.css'

const store = configureStore()
window.store = store

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <ThemeProvider theme={lightTheme}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
)
