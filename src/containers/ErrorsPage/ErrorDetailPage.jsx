import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Box } from '@strapi/design-system'
import { getDetail, deleteTableItem } from '@store/content/reducer'
import ConfirmModal from '@components/ConfirmModal'
import ErrorViewer from '@components/ErrorViewer'

export default function ErrorDetailPage () {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const contentDetail = useSelector(state => state.content.contentDetail) || { data: {} }
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const onDeleteItem = () => {
    dispatch(deleteTableItem({ tableName: 'error', id }))
    setConfirmModalOpen(false)
    navigate(-1)
  }

  useEffect(() => {
    dispatch(getDetail({ tableName: 'error', id }))
  }, [id])

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Box padding={8} style={{ width: '100%' }}>
      <ErrorViewer
        {...contentDetail.data}
        onCancel={goBack}
        onDelete={() => { setConfirmModalOpen(true) }}
      />
      <ConfirmModal
        confirmText='Confirm'
        content='Press confirm to delete the item'
        title='Delete Content'
        show={confirmModalOpen}
        hideCancel={false}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={onDeleteItem}
      />
    </Box>
  )
}
