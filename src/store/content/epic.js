import { ofType } from 'redux-observable'
import { from, of, concat } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import api from '@api'
import { getSchemas, setSchemas, getTableData, setTableData } from './reducer'

export const getSchemaEpic = (action$, state$) => action$.pipe(
  ofType(getSchemas().type),
  withLatestFrom(state$),
  switchMap(([_, state]) =>
    from(api.getSchemas(state.auth.jwt)).pipe(
      switchMap((response) => {
        return concat(
          of(setSchemas({ schemas: response }))
        )
      })
    )
  )
)

export const getTableDataEpic = (action$, state$) => action$.pipe(
  ofType(getTableData().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.getTableData(action.payload, state.auth.jwt)).pipe(
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
  )
)
