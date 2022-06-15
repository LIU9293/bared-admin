import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '@store/content/reducer'
import { Box } from '@strapi/design-system/Box'
import { Typography } from '@strapi/design-system/Typography'
import { Badge } from '@strapi/design-system/Badge'
import { Accordion, AccordionToggle, AccordionContent } from '@strapi/design-system/Accordion'

export default function ContentApi () {
  const { tableName } = useParams()
  const [expandKey, setExpandKey] = useState('')
  const dispatch = useDispatch()
  const api = useSelector(state => state.content.api[tableName]) || []
  const schemas = useSelector(state => state.content.schemas)
  const baseUrl = window.localStorage.getItem('endpoint')

  useEffect(() => {
    dispatch(getApi({ tableName }))
  }, [tableName])

  return (
    <Box padding={8} background='neutral100'>
      <Typography variant='alpha'>{`${tableName.toUpperCase()} - User Services`}</Typography>
      {/* <Box paddingBottom={8}>
        <Typography variant='epsilon'>Click to expand routes</Typography>
      </Box> */}
    </Box>
  )
}
