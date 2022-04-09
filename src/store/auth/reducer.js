import { createAction, createReducer } from 'redux-act'

const INITIAL_STATE = {
  user: {},
  jwt: ''
}

export const login = createAction('login')
export const setAuthData = createAction('set_auth_data')

window.login = login

const authRedcuer = createReducer({
  [setAuthData]: (state, payload) => ({
    ...state,
    user: payload.user,
    jwt: payload.jwt
  })
}, INITIAL_STATE)

export default authRedcuer