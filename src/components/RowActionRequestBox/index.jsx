import { useState } from 'react'
import { Typography, Button, TextInput, ToggleInput, Box, Flex } from '@strapi/design-system'

export default function RowActionRequestBox ({
  text,
  serviceName,
  inputParams = {},
  onServiceCall
}) {
  const [inputData, setInputData] = useState({})

  const inputParamsKeys = Object.keys(inputParams)

  const handleServiceCall = () => {
    onServiceCall(inputData)
  }

  const onValueChange = (e, attr) => {
    setInputData({
      ...inputData,
      [attr]: e
    })
  }

  const onInputChange = (e, key) => {
    if (e.target.checked) {
      setInputData({ ...inputData, [key]: true })
    } else {
      setInputData({ ...inputData, [key]: false })
    }
  }

  return (
    <Box hasRadius background='neutral0' shadow='tableShadow' className='mt8' padding={4}>
      <Flex direction='column' alignItems='flex-start'>
        <Typography variant='delta'>{text}</Typography>
        <Typography variant='omega'>Service Name: {serviceName}</Typography>
        {inputParamsKeys && inputParamsKeys.length > 0 && inputParamsKeys.map(key => {
          const inputType = inputParams[key]
          return (
            <Flex direction='column' key={key} alignItems='flex-start'>
              <Typography variant='delta' fontWeight='bold'>{key}</Typography>
              {inputType === 'boolean' && (
                <ToggleInput
                  key={key}
                  onLabel='On'
                  offLabel='Off'
                  checked={typeof inputData[key] === 'undefined' ? null : inputData[key]}
                  onChange={e => onInputChange(e, key)}
                />
              )}
              {inputType === 'string' && (
                <TextInput
                  key={key}
                  name={key}
                  label={key}
                  value={inputData[key] || ''}
                  onChange={e => onValueChange(e.target.value, key)}
                />
              )}
            </Flex>
          )
        })}
        <Box className='mt8'>
          <Button onClick={handleServiceCall}>Request</Button>
        </Box>
      </Flex>
    </Box>
  )
}
