import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextInput } from '@strapi/design-system/TextInput'
import { Button } from '@strapi/design-system/Button'
import { Box } from '@strapi/design-system/Box'
import { Typography } from '@strapi/design-system/Typography'
import { Alert } from '@strapi/design-system/Alert'
import { login, setEndpoint } from '@store/auth/reducer'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginBackground, LoginContainer } from './style'

export default function LoginPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const jwt = useSelector(state => state.auth.jwt)
  const endpoint = useSelector(state => state.auth.endpoint)

  useEffect(() => {
    if (jwt) {
      window.localStorage.setItem('jwt', jwt)
      navigate(from, { replace: true })
    }
  }, [jwt])

  const onLogin = () => {
    window.localStorage.setItem('endpoint', endpoint)
    dispatch(login({ username, password }))
  }

  const handleLogin = () => {
    if (!username || !password) {
      // TODO: check if password meet some requirement
      return setError('username or password missing')
    }
    setError(null)
    onLogin()
  }

  const handleSetEndpoint = endpoint => {
    dispatch(setEndpoint({ endpoint }))
  }

  return (
    <LoginBackground>
      <LoginContainer>
        {
          error &&
            <Alert
              closeLabel='Close alert'
              title='Title'
              variant='danger'
            >
              {error}
            </Alert>
        }
        <Typography variant='beta'>Bared CMS</Typography>
        <Box paddingBottom={4} paddingTop={4}>
          <TextInput
            placeholder='Type your server endpoint'
            label='Endpoint'
            name='Endpoint'
            onChange={e => handleSetEndpoint(e.target.value)}
            value={endpoint}
          />
        </Box>
        <Box paddingBottom={4} paddingTop={4}>
          <TextInput
            placeholder='Type your username'
            label='Username'
            name='Username'
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
        </Box>
        <Box paddingBottom={4}>
          <TextInput
            placeholder='Type your password'
            label='Password'
            name='Password'
            onChange={e => setPassword(e.target.value)}
            value={password}
            type='password'
          />
        </Box>
        <Button onClick={handleLogin} fullWidth>
          Login
        </Button>
      </LoginContainer>
    </LoginBackground>
  )
}
