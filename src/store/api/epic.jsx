import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import api from '@api'
import { callDapi, setCallDapiStatus, getAllRouters, setAllRouters } from './reducer'

export const callDapiEpic = (action$, state$) => action$.pipe(
  ofType(callDapi().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.callDapi(action.payload, state.auth.jwt)).pipe(
      switchMap(_ => {
        return of(
          setCallDapiStatus({ status: true })
        )
      })
    )
  )
)

export const getAllRoutersEpic = (action$, state$) => action$.pipe(
  ofType(getAllRouters().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.getAllRouters(action.payload, state.auth.jwt)).pipe(
      switchMap(data => {
        return of(
          setAllRouters({ routers: data })
        )
      })
    )
  )
)
