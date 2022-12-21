import { useState } from 'react'
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Typography } from '@strapi/design-system/Typography'
import { Button } from '@strapi/design-system/Button'
import { TextInput } from '@strapi/design-system/TextInput'
import { Box } from '@strapi/design-system/Box'

export default function AddEnvModal ({ show, onCancel, onAdd }) {
  if (!show) return null

  const [name, setName] = useState('')
  const [endpoint, setEndpoint] = useState('')

  const onNameChange = e => {
    setName(e.target.value)
  }

  const onEndpointChange = e => {
    setEndpoint(e.target.value)
  }

  const onConfirm = () => {
    onAdd({ name, endpoint })
  }

  return (
    <ModalLayout onClose={onCancel} labelledBy='title'>
      <ModalHeader>
        <Typography fontWeight='bold' textColor='neutral800' as='h2' id='title'>
          Add Env Config
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Typography variant='omega'>Name</Typography>
        <Box marginBottom={4}>
          <TextInput aria-label='Name' name='Name' value={name} onChange={onNameChange} />
        </Box>
        <Typography variant='omega'>Endpoint</Typography>
        <Box>
          <TextInput aria-label='Endpoint' name='Endpoint' value={endpoint} onChange={onEndpointChange} />
        </Box>
      </ModalBody>
      <ModalFooter
        endActions={(
          <>
            <Button variant='secondary' onClick={onCancel}>Cancel</Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </>
        )}
      />
    </ModalLayout>
  )
}
