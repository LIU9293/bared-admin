import { ofType } from 'redux-observable'
import { from, of, concat } from 'rxjs'
import { switchMap, mergeMap } from 'rxjs/operators'
import api from '@api'
import { login, setAuthData, getProfile } from './reducer'
import { getSchemas } from '@store/content/reducer'

export const getProfileEpic = action$ => action$.pipe(
  ofType(getProfile().type),
  mergeMap((action) =>
    from(api.getProfile(action.payload.jwt)).pipe(
      switchMap((response) => {
        return concat(
          of(setAuthData({ user: response, jwt: action.payload.jwt })),
          of(getSchemas())
        )
      })
    )
  )
)

export const authEpic = action$ => action$.pipe(
  ofType(login().type),
  mergeMap(action =>
    from(api.authLocal(action.payload)).pipe(
      switchMap((response) => {
        const { user, jwt } = response

        if (action.payload?.onLogin) {
          return concat(
            of(setAuthData({ user, jwt })),
            of(getSchemas()),
            of(action.payload.onLogin)
          )
        }

        return concat(
          of(setAuthData({ user, jwt })),
          of(getSchemas())
        )
      })
    )
  )
)
