import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Typography } from '@strapi/design-system/Typography'
import { Button } from '@strapi/design-system/Button'
// import { Box } from '@strapi/design-system/Box'

import RowActionRequestBox from '@components/RowActionRequestBox'

export default function ServiceModal ({
  show,
  onCancel,
  title,
  services,
  onServiceCall = () => {}
}) {
  const handleServiceCall = (data, service) => {
    onServiceCall({
      ...service,
      params: { ...service.params, ...data }
    })
  }

  if (!show) return null
  return (
    <ModalLayout onClose={onCancel} labelledBy='title'>
      <ModalHeader>
        <Typography fontWeight='bold' textColor='neutral800' as='h2' id='title'>
          {title || 'Actions'}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {services.map((service, idx) => {
          return (
            <RowActionRequestBox
              key={idx}
              {...service}
              onServiceCall={e => handleServiceCall(e, service)}
            />
          )
        })}
      </ModalBody>
      <ModalFooter
        endActions={(<Button variant='secondary' onClick={onCancel}>Cancel</Button>)}
      />
    </ModalLayout>
  )
}
