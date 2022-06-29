import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box } from '@strapi/design-system/Box'
import { Typography } from '@strapi/design-system/Typography'
import { Flex } from '@strapi/design-system/Flex'
import { TextInput } from '@strapi/design-system/TextInput'
import { Textarea } from '@strapi/design-system/Textarea'
import { Button } from '@strapi/design-system/Button'
import { NumberInput } from '@strapi/design-system/NumberInput'
import CardSelect from '@components/CardSelect'
import ConfirmModal from '@components/ConfirmModal'
import { request } from '@api'
import ReactJson from 'react-json-view'

export default function ServiceDetail () {
  const { serviceName } = useParams()
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [inputData, setInputData] = useState({})
  // const [isResponseError, setResponseError] = useState(false)
  const [responseContent, setResponseContent] = useState({})
  const jwt = useSelector(state => state.auth.jwt)

  const serviceDetail = useSelector(state => state.content.services.find(i => i.name.toLowerCase() === serviceName.toLowerCase())) || {}

  useEffect(() => {
    setResponseContent({})
  }, [serviceName])

  const onValueChange = (e, attr) => {
    setInputData({
      ...inputData,
      [attr]: e
    })
  }

  const handleRequestButtonClick = () => {
    setConfirmModalOpen(true)
  }

  const onRequestService = () => {
    setConfirmModalOpen(false)
    request({
      method: 'post',
      url: `/dapi/service/${serviceName.toLowerCase()}`,
      needToken: true,
      jwt,
      payload: inputData
    })
      .then(response => {
        setResponseContent(response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const { params = {} } = serviceDetail
  return (
    <Box padding={8} background='neutral100'>
      <Typography variant='alpha'>{`${serviceName}`}</Typography>
      <Box paddingTop={8} paddingBottom={2}>
        {
        Object.keys(params).map(attr => {
          const config = params[attr] || 'string'
          return (
            <Box paddingBottom={4} key={attr}>
              {config === 'string' &&
                <TextInput
                  name={attr}
                  label={attr}
                  value={inputData[attr] || ''}
                  onChange={e => onValueChange(e.target.value, attr)}
                />}
              {config === 'integer' &&
                <NumberInput
                  id={attr}
                  name={attr}
                  label={attr}
                  value={inputData[attr] || 0}
                  onValueChange={e => onValueChange(e, attr)}
                />}
              {config === 'boolean' &&
                <Flex direction='column' alignItems='flex-start'>
                  <Typography variant='pi' fontWeight='bold'>{attr}</Typography>
                  <Flex>
                    <CardSelect
                      style={{ marginTop: 12, marginRight: 12 }}
                      title='On'
                      selected={inputData[attr] === true}
                      onClick={() => onValueChange(true, attr)}
                    />
                    <CardSelect
                      style={{ marginTop: 12 }}
                      title='Off'
                      selected={inputData[attr] === false}
                      onClick={() => onValueChange(false, attr)}
                    />
                  </Flex>
                </Flex>}
              {(config === 'json' || config === 'text') &&
                <Textarea
                  label={attr}
                  name={attr}
                  onChange={e => {
                    onValueChange(e.target.value, attr)
                  }}
                  value={inputData[attr] || ''}
                />}
            </Box>
          )
        })
      }
      </Box>
      <Flex>
        <Button onClick={handleRequestButtonClick}>Request</Button>
      </Flex>
      {
        responseContent && JSON.stringify(responseContent) !== '{}' &&
        <Box paddingTop={8}>
          <Typography variant='delta'>Service Result</Typography>
          <ReactJson src={responseContent} name={false} style={{ marginTop: 12 }} />
        </Box>
      }
      <ConfirmModal
        content={`Call ${serviceName} Service?`}
        title='Confirm'
        show={confirmModalOpen}
        hideCancel={false}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={onRequestService}
      />
    </Box>
  )
}
