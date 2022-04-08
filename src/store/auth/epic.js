import { ofType } from 'redux-observable'
import { from, of, concat } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import api from '@api'
import { login, setAuthData } from './reducer'
import { getSchemas } from '@store/content/reducer'

export const authEpic = action$ => action$.pipe(
  ofType(login().type),
  switchMap(_ =>
    from(api.authTest()).pipe(
      switchMap((response) => {
        const { user, jwt } = response
        return concat(
          of(setAuthData({ user, jwt })),
          of(getSchemas())
        )
      })
    )
  )
)
