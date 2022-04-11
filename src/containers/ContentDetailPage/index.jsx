import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getDetail } from '@store/content/reducer'
import { Typography } from '@strapi/design-system/Typography'
import { Box } from '@strapi/design-system/Box'
import { Flex } from '@strapi/design-system/Flex'
import { TextInput } from '@strapi/design-system/TextInput'
import { NumberInput } from '@strapi/design-system/NumberInput'
import { Textarea } from '@strapi/design-system/Textarea'
import { Button } from '@strapi/design-system/Button'
import CardSelect from '@components/CardSelect'
import { callDapi, setCallDapiStatus } from '@store/api/reducer'

export default function ContentDetail () {
  const { tableName, id } = useParams()
  const navigate = useNavigate()
  const isAdd = id === 'add'

  const dispatch = useDispatch()
  const contentDetail = useSelector(state => state.content.contentDetail)
  const attributes = useSelector(state => state.content.schemas.find(i => i.tableName === tableName)?.attributes) || {}

  const [inputData, setInputData] = useState({})
  const callDapiStatus = useSelector(state => state.api.callDapiStatus)

  useEffect(() => {
    if (!isAdd) {
      dispatch(getDetail({ tableName, id }))
    }
  }, [])

  useEffect(() => {
    if (callDapiStatus) {
      dispatch(setCallDapiStatus({ status: false }))
      navigate(-1)
    }
  }, [callDapiStatus])

  const onValueChange = (e, attr) => {
    console.log(e, attr)
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

  return (
    <Box padding={8} style={{ width: '100%' }}>
      <Box paddingBottom={4}>
        <Typography variant='alpha'>{isAdd ? 'Add item' + ' ' + tableName : `${tableName} - ID ${id}`}
        </Typography>
      </Box>
      {
        Object.keys(attributes).map(attr => {
          const config = attributes[attr]
          const data = contentDetail.data[attr]

          return (
            <Box paddingBottom={4} key={attr}>
              {config.type === 'string' &&
                <TextInput
                  name={attr}
                  label={attr}
                  value={inputData[attr] || data || ''}
                  onChange={e => onValueChange(e.target.value, attr)}
                />}
              {config.type === 'integer' &&
                <NumberInput
                  name={attr}
                  label={attr}
                  value={parseInt(inputData[attr]) || parseInt(data) || undefined}
                  onValueChange={e => onValueChange(e, attr)}
                />}
              {config.type === 'boolean' &&
                <Flex direction='column' alignItems='flex-start'>
                  <Typography variant='pi' fontWeight='bold'>{attr}</Typography>
                  <Flex>
                    <CardSelect
                      style={{ marginTop: 12, marginRight: 12 }}
                      title='On'
                      selected={typeof inputData[attr] === 'undefined'
                        ? data === 1
                        : inputData[attr] === true}
                      onClick={() => onValueChange(true, attr)}
                    />
                    <CardSelect
                      style={{ marginTop: 12 }}
                      title='Off'
                      selected={typeof inputData[attr] === 'undefined'
                        ? data === 0
                        : inputData[attr] === false}
                      onClick={() => onValueChange(false, attr)}
                    />
                  </Flex>

                </Flex>}
              {config.type === 'json' &&
                <Textarea
                  label={attr}
                  name={attr}
                  defaultValue={JSON.stringify(data)}
                  onChange={e => {
                    onValueChange(e.target.value, attr)
                  }}
                  value={inputData[attr] || data}
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
                        selected={
                          typeof inputData[attr] === 'undefined'
                            ? data === i
                            : inputData[attr] === i
                        }
                        onClick={() => onValueChange(i, attr)}
                      />
                    )
                  })}
                </Flex>}
            </Box>
          )
        })
      }
      <Box paddingTop={4}>
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
      </Box>
    </Box>
  )
}
