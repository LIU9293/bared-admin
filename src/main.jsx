import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from '@store'
import App from './app'

import 'rc-table/assets/index.css'
import './index.css'

const store = configureStore()
window.store = store

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
