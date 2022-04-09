import { ofType } from 'redux-observable'
import { from, of, concat } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import api from '@api'

import { login } from '@store/auth/reducer'
import { getApi, getSchemas, setSchemas, getTableData, setTableData, setApi } from './reducer'

export const getSchemaEpic = (action$, state$) => action$.pipe(
  ofType(getSchemas().type),
  withLatestFrom(state$),
  switchMap(([_, state]) =>
    from(api.getSchemas(state.auth.jwt)).pipe(
      switchMap((response) => {
        return of(setSchemas({ schemas: response }))
      })
    )
  )
)

export const getApiEpic = (action$, state$) => action$.pipe(
  ofType(getApi().type),
  withLatestFrom(state$),
  switchMap(([action, state]) => {
    if (!state.auth.jwt) {
      return of(login({ onLogin: action }))
    }

    return from(api.getApi(action.payload, state.auth.jwt)).pipe(
      switchMap((response) => {
        return of(setApi({
          tableName: action.payload.tableName,
          api: response
        }))
      })
    )
  })
)

export const getTableDataEpic = (action$, state$) => action$.pipe(
  ofType(getTableData().type),
  withLatestFrom(state$),
  switchMap(([action, state]) => {
    if (!state.auth.jwt) {
      return of(login({ onLogin: action }))
    }

    return from(api.getTableData(action.payload, state.auth.jwt)).pipe(
      switchMap((response) => {
        return concat(
          of(setTableData({
            tableName: action.payload.tableName,
            count: response[1],
            data: response[0]
          }))
        )
      })
    )
  })
)
