import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '@store/content/reducer'
import { Box } from '@strapi/design-system/Box'
import { Typography } from '@strapi/design-system/Typography'
import { Badge } from '@strapi/design-system/Badge'
import { Accordion, AccordionToggle, AccordionContent } from '@strapi/design-system/Accordion'
import ApiRequestBox from '@components/ApiRequestBox'

const deveoperApi = tableName => ([
  {
    url: `/dapi/${tableName}/:id`,
    method: 'GET',
    description: 'Get item with ID'
  },
  {
    url: `/dapi/${tableName}`,
    method: 'GET',
    description: 'Get data list with custom query',
    query: true
  },
  {
    url: `/dapi/${tableName}/count`,
    method: 'GET',
    description: 'Get total number of the content with custom query',
    query: true
  },
  {
    url: `/dapi/${tableName}/:id`,
    method: 'PUT',
    description: 'Get total number of the content with custom query',
    params: true
  },
  {
    url: `/dapi/${tableName}`,
    method: 'POST',
    description: 'Create an item',
    params: true
  },
  {
    url: `/dapi/${tableName}/:id`,
    method: 'DELETE',
    description: 'Delete an item'
  }
])

export default function ContentApi () {
  const { tableName } = useParams()
  const [expandKey, setExpandKey] = useState('')
  const dispatch = useDispatch()
  const api = useSelector(state => state.content.api[tableName]) || []
  const baseUrl = window.localStorage.getItem('endpoint')

  useEffect(() => {
    dispatch(getApi({ tableName }))
  }, [tableName])

  const handleToggle = key => {
    if (expandKey === key) {
      setExpandKey('')
    } else {
      setExpandKey(key)
    }
  }

  return (
    <Box padding={8} background='neutral100'>
      <Typography variant='alpha'>{`${tableName.toUpperCase()} - User routes`}</Typography>
      <Box paddingBottom={8}>
        <Typography variant='epsilon'>Click to expand routes</Typography>
      </Box>
      {
        api.map(item => {
          const key = `${item.method}_${item.url}`
          return (
            <Accordion
              expanded={expandKey === key}
              toggle={() => handleToggle(key)}
              id={key}
              key={key}
            >
              <AccordionToggle
                startIcon={<Badge active>{item.public ? 'Public' : 'Private'}</Badge>}
                title={`${item.method.toUpperCase()} - ${item.public ? '/api' : '/papi'}${item.url}`}
                description={item.description || ''}
              />
              <AccordionContent>
                <ApiRequestBox
                  method={item.method}
                  baseUrl={baseUrl}
                  requestUrl={(item.public ? '/api' : '/papi') + item.url}
                  requestParams={item.params}
                  isPublic={item.public}
                  showQuery={item.query}
                />
              </AccordionContent>
            </Accordion>
          )
        })
      }
      <Box paddingBottom={8} paddingTop={8}>
        <Typography variant='alpha'>{`${tableName.toUpperCase()} - Developer routes`}</Typography>
      </Box>
      {
        deveoperApi(tableName).map(item => {
          const key = `${item.method}_${item.url}`
          return (
            <Accordion
              expanded={expandKey === key}
              toggle={() => handleToggle(key)}
              id={key}
              key={key}
            >
              <AccordionToggle
                startIcon={<Badge active>Developer</Badge>}
                title={`${item.method.toUpperCase()} - ${item.url}`}
                description={item.description || ''}
              />
              <AccordionContent>
                <ApiRequestBox
                  method={item.method}
                  baseUrl={baseUrl}
                  requestUrl={item.url}
                  isPublic={false}
                  tableName={tableName}
                  showQuery={item.query}
                />
              </AccordionContent>
            </Accordion>
          )
        })
      }
    </Box>
  )
}
