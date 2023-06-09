import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Typography, Flex, TextInput, Button, Textarea, NumberInput } from '@strapi/design-system'
import styled from 'styled-components'
import { request } from '@api'
import CardSelect from '@components/CardSelect'
import ConfirmModal from '@components/ConfirmModal'
import ReactJson from 'react-json-view'

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px;
  border-radius: 4px;
  background: white;
  margin-top: 12px;
  width: 100%;
`

const StyledFlex = styled(Flex)`
  > div {
    width: 100%;
    margin-bottom: 12px;
  }
`

export default function ApiRequestBox ({
  requestParams,
  method,
  baseUrl,
  requestUrl,
  isPublic = false,
  showQuery = false
}) {
  // requestParams -> [ cover: {type: 'string', required: false} ]
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [responseContent, setResponseContent] = useState({})
  const [urlParamsData, setUrlParamsData] = useState({})
  const [inputData, setInputData] = useState({})
  const [queryInput, setQueryInput] = useState('')
  const [isResponseError, setResponseError] = useState(false)
  const [url, setUrl] = useState(requestUrl)
  const urlParams = requestUrl.split('/').filter(i => i.slice(0, 1) === ':')
  const jwt = useSelector(state => state.auth.jwt)

  const onValueChange = (e, attr) => {
    setInputData({
      ...inputData,
      [attr]: e
    })
  }

  const handleRequestButtonClick = () => {
    request({
      method,
      url,
      needToken: !isPublic,
      jwt,
      payload: inputData
    })
      .then(response => {
        setConfirmModalOpen(true)
        setResponseContent(response)

        if (!response.success) {
          setResponseError(true)
        } else {
          setResponseError(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSetUrlParamsData = (param, value) => {
    setUrlParamsData({
      ...urlParamsData,
      [param]: value
    })
  }

  useEffect(() => {
    const originalUrl = requestUrl
    let nextUrl = requestUrl
    if (Object.keys(urlParamsData).length > 0) {
      for (const i in urlParamsData) {
        nextUrl = originalUrl.replace(i, urlParamsData[i])
      }
    }

    if (queryInput) {
      nextUrl = nextUrl + '?' + queryInput
    }
    setUrl(nextUrl)
  }, [urlParamsData, queryInput])

  return (
    <Flex padding={4} direction='column' alignItems='flex-start'>
      <Flex paddingBottom={4}>Request URL: {baseUrl + url}</Flex>
      {
          urlParams && urlParams.length > 0 &&
            <Section>
              <Typography style={{ marginBottom: 8 }}>URL Params</Typography>
              {
                urlParams.map(param => {
                  return (
                    <StyledFlex key={param}>
                      <Typography style={{ marginRight: 8 }}>{param.replace(':', '').toUpperCase()}</Typography>
                      <TextInput
                        aria-label={param}
                        name={param.replace(':', '')}
                        value={urlParamsData[param] || ''}
                        onChange={e => handleSetUrlParamsData(param, e.target.value)}
                      />
                    </StyledFlex>
                  )
                })
              }
            </Section>
        }
      {
          requestParams && Object.keys(requestParams).length > 0 &&
            <Section>
              <Typography style={{ marginBottom: 8 }}>Request Params</Typography>
              {
                Object.keys(requestParams).map(attr => {
                  // param -> username
                  const config = requestParams[attr]
                  // paramConfig ->  { type: 'string', required: true }
                  return (
                    <StyledFlex key={attr}>
                      {config.type === 'string' &&
                        <TextInput
                          name={attr}
                          label={attr}
                          value={inputData[attr] || ''}
                          onChange={e => onValueChange(e.target.value, attr)}
                        />}
                      {config.type === 'json' &&
                        <Textarea
                          label={attr}
                          name={attr}
                          onChange={e => onValueChange(e.target.value, attr)}
                          value={inputData[attr] || ''}
                        />}
                      {(config.type === 'integer' || config.type === 'number' || config.type === 'float') &&
                        <NumberInput
                          name={attr}
                          label={attr}
                          value={parseInt(inputData[attr]) || undefined}
                          onValueChange={e => onValueChange(e, attr)}
                        />}
                      {config.type === 'boolean' &&
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
                    </StyledFlex>
                  )
                })
              }
            </Section>
        }
      {
        showQuery &&
          <Section>
            <Typography style={{ marginBottom: 8 }}>URL Query</Typography>
            <Flex>
              <TextInput
                name='URL Query'
                label='URL Query'
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
              />
            </Flex>
          </Section>
      }
      <Flex paddingTop={4}>
        <Button onClick={handleRequestButtonClick}>Request</Button>
      </Flex>
      <ConfirmModal
        confirmText='Close'
        title={isResponseError ? 'Request Error' : 'Request Succeed'}
        show={confirmModalOpen}
        hideCancel
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={() => setConfirmModalOpen(false)}
        ContentComponent={
          <ReactJson src={responseContent} name={false} />
        }
      />
    </Flex>
  )
}
