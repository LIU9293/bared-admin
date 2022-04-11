import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getDetail } from '@store/content/reducer'
import { Typography } from '@strapi/design-system/Typography'
import { Box } from '@strapi/design-system/Box'
import { TextInput } from '@strapi/design-system/TextInput'
import { NumberInput } from '@strapi/design-system/NumberInput'
import { ToggleInput } from '@strapi/design-system/ToggleInput'
import { Textarea } from '@strapi/design-system/Textarea'

export default function ContentDetail () {
  const { tableName, id } = useParams()
  const dispatch = useDispatch()
  const contentDetail = useSelector(state => state.content.contentDetail)
  const attributes = useSelector(state => state.content.schemas.find(i => i.tableName === tableName)?.attributes) || {}

  useEffect(() => {
    dispatch(getDetail({ tableName, id }))
  }, [])

  console.log(contentDetail.data, attributes)
  return (
    <Box padding={8} style={{ width: '100%' }}>
      <Box paddingBottom={4}>
        <Typography variant='alpha'>{`${tableName} - ID ${id}`}</Typography>
      </Box>
      {
        Object.keys(attributes).map(attr => {
          const config = attributes[attr]
          const data = contentDetail.data[attr]
          return (
            <Box paddingBottom={4} key={attr}>
              {config.type === 'string' &&
                <TextInput name={attr} label={attr} value={data} onValueChange={() => {}} />}
              {config.type === 'integer' &&
                <NumberInput name={attr} label={attr} value={data} onValueChange={() => {}} />}
              {config.type === 'boolean' &&
                <ToggleInput
                  onLabel='on'
                  offLabel='off'
                  checked={!!data}
                  label={attr}
                  onChange={() => {}}
                />}
              {config.type === 'json' &&
                <Textarea
                  label={attr}
                  value={JSON.stringify(data)}
                />}
            </Box>
          )
        })
      }
    </Box>
  )
}
