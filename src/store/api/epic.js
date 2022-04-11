import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import api from '@api'
import { callDapi, setCallDapiStatus } from './reducer'

export const getProfileEpic = (action$, state$) => action$.pipe(
  ofType(callDapi().type),
  withLatestFrom(state$),
  switchMap(([action, state]) =>
    from(api.callDapi(action.payload, state.auth.jwt)).pipe(
      switchMap((response) => {
        console.log(response)
        return of(
          setCallDapiStatus({ status: true })
        )
      })
    )
  )
)
