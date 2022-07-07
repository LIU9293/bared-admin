import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import { getApi } from '@store/content/reducer'
import { Box } from '@strapi/design-system/Box'
import { Typography } from '@strapi/design-system/Typography'
import { Badge } from '@strapi/design-system/Badge'
import { Accordion, AccordionToggle, AccordionContent } from '@strapi/design-system/Accordion'
import ApiRequestBox from '@components/ApiRequestBox'

// const deveoperApi = (tableName, schemas) => {
//   const attributes = schemas.find(i => i.tableName === tableName)?.attributes || {}
//   return [
//     {
//       url: `/dapi/${tableName}/:id`,
//       method: 'GET',
//       description: 'Get item with ID'
//     },
//     {
//       url: `/dapi/${tableName}`,
//       method: 'GET',
//       description: 'Get data list with custom query',
//       query: true
//     },
//     {
//       url: `/dapi/${tableName}/count`,
//       method: 'GET',
//       description: 'Get total number of the content with custom query',
//       query: true
//     },
//     {
//       url: `/dapi/${tableName}/:id`,
//       method: 'PUT',
//       description: 'Get total number of the content with custom query',
//       params: true,
//       attributes
//     },
//     {
//       url: `/dapi/${tableName}`,
//       method: 'POST',
//       description: 'Create an item',
//       params: true,
//       attributes
//     },
//     {
//       url: `/dapi/${tableName}/:id`,
//       method: 'DELETE',
//       description: 'Delete an item'
//     }
//   ]
// }

export default function ContentApi () {
  const { tableName } = useParams()
  const [expandKey, setExpandKey] = useState('')
  const api = useSelector(state => state.api.routers.find(i => i.name === tableName)?.routes) || []
  // const schemas = useSelector(state => state.content.schemas)
  const baseUrl = window.localStorage.getItem('endpoint')

  const handleToggle = key => {
    if (expandKey === key) {
      setExpandKey('')
    } else {
      setExpandKey(key)
    }
  }

  return (
    <Box padding={8} background='neutral100'>
      <Typography variant='alpha'>{`${tableName} - Routes`}</Typography>
      <Box paddingBottom={8}>
        <Typography variant='epsilon'>Click to expand routes</Typography>
      </Box>
      {api && api.length > 0 && api.map(item => {
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
      })}
    </Box>
  )
}
