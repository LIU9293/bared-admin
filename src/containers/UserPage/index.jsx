import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@strapi/design-system/Box'
import { Typography } from '@strapi/design-system/Typography'
import { Button } from '@strapi/design-system/Button'
import ConfirmModal from '@components/ConfirmModal'

export default function UserPage () {
  const user = useSelector(state => state.auth.user)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const onLogout = () => {
    window.localStorage.removeItem('jwt')
    window.localStorage.removeItem('endpoint')
    window.localStorage.removeItem('bared-admin-table-config')
    window.location.href = '/login'
  }

  return (
    <Box padding={8}>
      <Typography variant='alpha'>{user.name}</Typography>
      <Button onClick={() => setLogoutModalOpen(true)}>Logout</Button>
      <ConfirmModal
        confirmText='Logout'
        title='Logout'
        content='By logout, you will lose all your local settings and sessions'
        show={logoutModalOpen}
        hideCancel={false}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={onLogout}
      />
    </Box>
  )
}
