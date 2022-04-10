import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextInput } from '@strapi/design-system/TextInput'
import { Box } from '@strapi/design-system/Box'
import { Button } from '@strapi/design-system/Button'
import { Alert } from '@strapi/design-system/Alert'
import { login } from '@store/auth/reducer'
import { useNavigate, useLocation } from 'react-router-dom'

export default function LoginPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const jwt = useSelector(state => state.auth.jwt)

  useEffect(() => {
    if (jwt) {
      window.localStorage.setItem('jwt', jwt)
      navigate(from, { replace: true })
    }
  }, [jwt])

  const onLogin = () => {
    dispatch(
      login({ username, password })
    )
  }

  const handleLogin = () => {
    if (!username || !password) {
      // TODO: check if password meet some requirement
      return setError('username or password missing')
    }
    setError(null)
    onLogin()
  }

  return (
    <div className='app'>
      <Box padding={10}>
        {
          error &&
            <Alert
              closeLabel='Close alert'
              title='Title'
              variant='danger'
            >
              This is the default variant.
            </Alert>
        }

        <TextInput
          placeholder='Type your username'
          label='Username'
          name='Username'
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
        <TextInput
          placeholder='Type your password'
          label='Password'
          name='Password'
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        <Button onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </div>
  )
}
