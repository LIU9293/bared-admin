import { createAction, createReducer } from 'redux-act'

const INITIAL_STATE = {
  user: {},
  jwt: ''
}

export const login = createAction('login')
export const getProfile = createAction('get_profile')
export const setAuthData = createAction('set_auth_data')

const authRedcuer = createReducer({
  [setAuthData]: (state, payload) => ({
    ...state,
    user: payload.user,
    jwt: payload.jwt
  })
}, INITIAL_STATE)

export default authRedcuer
