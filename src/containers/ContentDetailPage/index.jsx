import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { NumberInput, Button, Textarea, TextInput, Flex, Box, Typography } from '@strapi/design-system'
import CardSelect from '@components/CardSelect'
import Avatar from '@components/Avatar'
import ConfirmModal from '@components/ConfirmModal'
import { deleteTableItem, getDetail } from '@store/content/reducer'
import { callDapi, setCallDapiStatus } from '@store/api/reducer'

export default function ContentDetail () {
  const { tableName, id } = useParams()
  const navigate = useNavigate()
  const isAdd = id === 'add'

  const dispatch = useDispatch()
  const contentDetail = isAdd
    ? { data: {} }
    : useSelector(state => state.content.contentDetail)
  const attributes = useSelector(state => state.content.schemas.find(i => i.tableName === tableName)?.attributes) || {}

  const [inputData, setInputData] = useState({})
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const callDapiStatus = useSelector(state => state.api.callDapiStatus)

  const onDeleteItem = () => {
    if (isAdd) return
    dispatch(deleteTableItem({ tableName, id }))
    setConfirmModalOpen(false)
    navigate(-1)
  }

  useEffect(() => {
    if (!isAdd) {
      dispatch(getDetail({ tableName, id }))
    }
    setInputData({})
  }, [id, tableName])

  useEffect(() => {
    if (callDapiStatus) {
      dispatch(setCallDapiStatus({ status: false }))
      navigate(-1)
    }
  }, [callDapiStatus])

  const onValueChange = (e, attr) => {
    setInputData({
      ...inputData,
      [attr]: e
    })
  }

  const onAdd = () => {
    dispatch(callDapi({
      tableName,
      callMethod: 'create',
      ...inputData
    }))
  }

  const onUpdate = () => {
    dispatch(callDapi({
      tableName,
      callMethod: 'update',
      id,
      ...inputData
    }))
  }

  const onCancel = () => {
    navigate(-1)
  }

  const allColumns = Object.keys(attributes).concat(isAdd ? [] : ['created_at', 'updated_at'])
  return (
    <Box padding={8} style={{ width: '100%' }}>
      <Box paddingBottom={4}>
        <Typography variant='alpha'>
          {isAdd ? 'Add item' + ' ' + tableName : `${tableName} - ID ${id}`}
        </Typography>
      </Box>
      {
        allColumns.map(attr => {
          const config = attributes[attr] || { type: 'string' }
          const data = contentDetail.data[attr]
          const noInputData = typeof inputData[attr] === 'undefined'

          if (!isAdd && typeof (noInputData ? data : inputData[attr]) === 'undefined') {
            return null
          }

          return (
            <Box paddingBottom={4} key={attr}>
              {config.type === 'string' &&
                <TextInput
                  name={attr}
                  label={attr}
                  value={noInputData ? (data || '') : inputData[attr]}
                  onChange={e => onValueChange(e.target.value, attr)}
                />}
              {(config.type === 'integer' || config.type === 'number' || config.type === 'float' || config.type === 'bigint') &&
                <NumberInput
                  name={attr}
                  label={attr}
                  value={noInputData ? data : inputData[attr]}
                  onValueChange={e => onValueChange(e, attr)}
                />}
              {config.type === 'boolean' &&
                <Flex direction='column' alignItems='flex-start'>
                  <Typography variant='pi' fontWeight='bold'>{attr}</Typography>
                  <Flex>
                    <CardSelect
                      style={{ marginTop: 12, marginRight: 12 }}
                      title='On'
                      selected={noInputData
                        ? data === 1
                        : inputData[attr] === true}
                      onClick={() => onValueChange(true, attr)}
                    />
                    <CardSelect
                      style={{ marginTop: 12 }}
                      title='Off'
                      selected={noInputData
                        ? data === 0
                        : inputData[attr] === false}
                      onClick={() => onValueChange(false, attr)}
                    />
                  </Flex>
                </Flex>}
              {(config.type === 'json' || config.type === 'text') &&
                <Textarea
                  label={attr}
                  name={attr}
                  onChange={e => {
                    onValueChange(e.target.value, attr)
                  }}
                  value={noInputData
                    ? JSON.stringify(data)
                    : inputData[attr]}
                />}
              {config.type === 'enum' &&
                <Flex direction='column' alignItems='flex-start'>
                  <Typography variant='pi' fontWeight='bold'>{attr}</Typography>
                  {config.enum.map(i => {
                    return (
                      <CardSelect
                        style={{ marginTop: 12 }}
                        key={i}
                        title={i}
                        selected={noInputData
                          ? data === i
                          : inputData[attr] === i}
                        onClick={() => onValueChange(i, attr)}
                      />
                    )
                  })}
                </Flex>}
              {config.tableConfig?.showAsAvatar && !isAdd &&
                <Box paddingTop={4}>
                  <Avatar src={data} />
                </Box>}
              {config.join && config.join.table && data &&
                <Box paddingTop={4}>
                  <Link to={`/content-detail/${config.join.table}/${data}`}>
                    {`${config.join.table} - ${data}`}
                  </Link>
                </Box>}
            </Box>
          )
        })
      }
      <Box paddingTop={4}>
        <Flex justifyContent='space-between'>
          <Flex>
            <Button onClick={isAdd ? onAdd : onUpdate}>{isAdd ? 'Add Item' : 'Update Item'}</Button>
            <Button
              variant='tertiary'
              style={{ marginLeft: 12 }}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Flex>
          {!isAdd && (
            <Flex>
              <Button variant='danger' onClick={() => { setConfirmModalOpen(true) }}>
                Delete
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>
      <ConfirmModal
        confirmText='Delete'
        title='Delete Content'
        show={confirmModalOpen}
        hideCancel={false}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={onDeleteItem}
      />
    </Box>
  )
}
