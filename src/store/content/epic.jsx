import { ofType } from 'redux-observable'
import { from, of, concat } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import api from '@api'

import { login } from '@store/auth/reducer'
import {
  deleteTableItem,
  createTableItem,
  updateTableItem,
  getApi,
  getSchemas,
  setSchemas,
  getTableData,
  setTableData,
  setApi,
  getDetail,
  setDetail
} from './reducer'

export const getDetailEpic = (action$, state$) => action$.pipe(
  ofType(getDetail().type),
  withLatestFrom(state$),
  switchMap(([action, state]) => {
    if (!state.auth.jwt) {
      return of(login({ onLogin: action }))
    }

    return from(api.getDetail(action.payload, state.auth.jwt)).pipe(
      switchMap(response => {
        return of(setDetail({ data: response }))
      })
    )
  })
)

export const deleteTableItemEpic = (action$, state$) => action$.pipe(
  ofType(deleteTableItem().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.deleteTableItem(action.payload, state.auth.jwt)).pipe(
      switchMap(_ => {
        return of(getTableData({
          tableName: action.payload.tableName,
          page: action.payload.page,
          pageSize: action.payload.pageSize
        }))
      })
    )
  )
)

export const createTableItemEpic = (action$, state$) => action$.pipe(
  ofType(createTableItem().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.createTableItem(action.payload, state.auth.jwt)).pipe(
      switchMap(_ => {
        return of(getTableData({ tableName: action.payload.tableName }))
      })
    )
  )
)

export const updateTableItemEpic = (action$, state$) => action$.pipe(
  ofType(updateTableItem().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.updateTableItem(action.payload, state.auth.jwt)).pipe(
      switchMap(_ => {
        return of(getTableData({ tableName: action.payload.tableName }))
      })
    )
  )
)

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
            count: response[1].count,
            data: response[0]
          }))
        )
      })
    )
  })
)
