import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Flex, Button, Typography, Box } from '@strapi/design-system'
import ConfirmModal from '@components/ConfirmModal'
import CardSelect from '@components/CardSelect'
import Avatar from '@components/Avatar'
import AddEnvModal from '@components/AddEnvModal'

export default function UserPage () {
  const user = useSelector(state => state.auth.user)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [addEnvModalOpen, setAddEnvModalOpen] = useState(false)
  const [envConfig, setEnvConfig] = useState([])
  const [currentEndpoint, setCurrentEndpoint] = useState('')

  useEffect(() => {
    const config = window.localStorage.getItem('bared-admin-env-config')
    if (config && JSON.parse(config)) {
      setEnvConfig(JSON.parse(config))
    }

    const endp = window.localStorage.getItem('endpoint')
    if (endp) {
      setCurrentEndpoint(endp)
    }
  }, [])

  const onAddEnv = ({ name, endpoint }) => {
    const newConfig = [...envConfig, { name, endpoint }]
    setAddEnvModalOpen(false)
    window.localStorage.setItem('bared-admin-env-config', JSON.stringify(newConfig))
    window.location.reload()
  }

  const onSetEnv = ({ endpoint }) => {
    window.localStorage.setItem('endpoint', endpoint)
    window.localStorage.removeItem('jwt')
    window.location.href = '/login'
  }

  const onLogout = () => {
    window.localStorage.removeItem('jwt')
    window.localStorage.removeItem('endpoint')
    window.localStorage.removeItem('bared-admin-table-config')
    window.location.href = '/login'
  }

  return (
    <Box padding={8}>
      <Avatar src={user.avatar} alt='avatar' />
      <Box>
        <Typography variant='delta'>Current User: {user.name}</Typography>
      </Box>
      <Box>
        <Typography variant='delta'>Auth type: {user.auth_type}</Typography>
      </Box>
      <Box marginTop={8}>
        <Typography variant='delta'>Environment Configs</Typography>
      </Box>
      <Flex direction='row' alignItems='flex-center' marginTop={4}>
        {envConfig.map(item => {
          return (
            <CardSelect
              key={item.name}
              title={item.name}
              description={'Endpoint: ' + item.endpoint}
              onClick={() => { onSetEnv(item) }}
              selected={item.endpoint === currentEndpoint}
              style={{ marginRight: 16 }}
            />
          )
        })}
      </Flex>
      <Box marginTop={2}>
        <Button onClick={() => { setAddEnvModalOpen(true) }} variant='secondary'>Add Env</Button>
      </Box>
      <Box marginTop={8}>
        <Button onClick={() => setLogoutModalOpen(true)}>Logout</Button>
      </Box>
      <ConfirmModal
        confirmText='Logout'
        title='Logout'
        content='By logout, you will lose all your local settings and sessions'
        show={logoutModalOpen}
        hideCancel={false}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={onLogout}
      />
      <AddEnvModal
        show={addEnvModalOpen}
        onCancel={() => setAddEnvModalOpen(false)}
        onAdd={onAddEnv}
      />
    </Box>
  )
}
