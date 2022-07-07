import { createAction, createReducer } from 'redux-act'

const INITIAL_STATE = {
  routers: [],
  callDapiStatus: false
}

export const callDapi = createAction('call_dapi')
export const setCallDapiStatus = createAction('set_call_dapi_status')
export const getAllRouters = createAction('get_all_routers')
export const setAllRouters = createAction('set_all_routers ')

const apiReducer = createReducer({
  [callDapi]: (state, payload) => ({
    ...state,
    callDapiStatus: false
  }),

  [setCallDapiStatus]: (state, payload) => ({
    ...state,
    callDapiStatus: payload.status
  }),

  [setAllRouters]: (state, payload) => ({
    ...state,
    routers: payload.routers
  })
}, INITIAL_STATE)

export default apiReducer
