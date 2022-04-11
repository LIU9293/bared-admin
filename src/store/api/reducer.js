import { createAction, createReducer } from 'redux-act'

const INITIAL_STATE = {
  callDapiStatus: false
}

export const callDapi = createAction('call_dapi')
export const setCallDapiStatus = createAction('set_call_dapi_status')

const apiReducer = createReducer({
  [callDapi]: (state, payload) => ({
    ...state,
    callDapiStatus: false
  }),

  [setCallDapiStatus]: (state, payload) => ({
    ...state,
    callDapiStatus: payload.status
  })
}, INITIAL_STATE)

export default apiReducer
