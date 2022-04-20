import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'

import authReducer from './auth/reducer'
import contentReducer from './content/reducer'
import apiReducer from './api/reducer'

import * as authEpics from './auth/epic'
import * as contentEpics from './content/epic'
import * as apiEpics from './api/epic'

export const rootEpic = combineEpics(
  ...Object.values(authEpics),
  ...Object.values(contentEpics),
  ...Object.values(apiEpics)
)

export const rootReducer = combineReducers({
  auth: authReducer,
  content: contentReducer,
  api: apiReducer
})
