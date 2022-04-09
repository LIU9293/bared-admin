import { ofType } from 'redux-observable'
import { from, of, concat } from 'rxjs'
import { switchMap, mergeMap } from 'rxjs/operators'
import api from '@api'
import { login, setAuthData } from './reducer'
import { getSchemas } from '@store/content/reducer'

export const authEpic = action$ => action$.pipe(
  ofType(login().type),
  mergeMap(action =>
    from(api.authTest()).pipe(
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
