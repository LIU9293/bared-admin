import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'

import authReducer from './auth/reducer'
import contentReducer from './content/reducer'

import * as authEpics from './auth/epic'
import * as contentEpics from './content/epic'

export const rootEpic = combineEpics(
  ...Object.values(authEpics),
  ...Object.values(contentEpics)
)

export const rootReducer = combineReducers({
  auth: authReducer,
  content: contentReducer
})
