import React from 'react'
// import ReactDOM from 'react-dom/client'
import { render } from 'react-dom'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from '@store'
import { ThemeProvider } from '@strapi/design-system/ThemeProvider'
import { lightTheme } from '@strapi/design-system/themes'
import App from './app'
import './index.css'

const store = configureStore()
window.store = store

const container = document.getElementById('root')
// const root = ReactDOM.createRoot(container)

render(
  <ThemeProvider theme={lightTheme}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
  , container)

// root.render(
//   <ThemeProvider theme={lightTheme}>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   </ThemeProvider>
// )
