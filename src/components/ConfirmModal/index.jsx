import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout'
import { Typography } from '@strapi/design-system/Typography'
import { Button } from '@strapi/design-system/Button'

export default function ConfirmModal ({ show, onCancel, onConfirm, title, content }) {
  if (!show) return null

  return (
    <ModalLayout onClose={onCancel} labelledBy='title'>
      <ModalHeader>
        <Typography fontWeight='bold' textColor='neutral800' as='h2' id='title'>
          {title || 'Confirm'}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Typography variant='omega'>{content || 'Do you confirm?'}</Typography>
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
