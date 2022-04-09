import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getApi } from '@store/content/reducer'
import { Box } from '@strapi/design-system/Box'
import { Accordion, AccordionToggle, AccordionContent } from '@strapi/design-system/Accordion'

export default function ContentApi () {
  const { tableName } = useParams()
  const [expandKey, setExpandKey] = useState('')
  const dispatch = useDispatch()
  const api = useSelector(state => state.content.api[tableName]) || []
  console.log(api)

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
                title={`${item.method} - ${item.url}`}
                description={item.description || ''}
              />
              <AccordionContent>
                <Box padding={3}>
                  {
                    item.params
                      ? JSON.stringify(item.params, null, 2)
                      : 'No params defined in router file'
                  }
                </Box>
              </AccordionContent>
            </Accordion>
          )
        })
      }

    </Box>
  )
}
