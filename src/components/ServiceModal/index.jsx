import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Typography } from '@strapi/design-system/Typography'
import { Button } from '@strapi/design-system/Button'
import { Box } from '@strapi/design-system/Box'

export default function ServiceModal ({
  show,
  onCancel,
  title,
  services,
  onServiceCall = () => {}
}) {
  if (!show) return null
  return (
    <ModalLayout onClose={onCancel} labelledBy='title'>
      <ModalHeader>
        <Typography fontWeight='bold' textColor='neutral800' as='h2' id='title'>
          {title || 'Actions'}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {services.map((service, idx) => (
          <Box padding={4} marginBottom={4} hasRadius background="neutral0" key={`box-${idx}`} shadow="tableShadow" className='pointer' onClick={() => onServiceCall(service)}>
            <Typography>{service.text}</Typography>
          </Box>)
        )}
      </ModalBody>
      <ModalFooter
        endActions={(<Button variant='secondary' onClick={onCancel}>Cancel</Button>)}
      />
    </ModalLayout>
  )
}
