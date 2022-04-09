import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getTableData } from '@store/content/reducer'
import { Box } from '@strapi/design-system/Box'
import { Table, TFooter, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table'
import { Typography } from '@strapi/design-system/Typography'
import Plus from '@strapi/icons/Plus'

export default function ContentTable () {
  const { tableName } = useParams()
  const dispatch = useDispatch()
  const tableData = useSelector(state => {
    const res = state.content.tableData[tableName]
    if (res && res.data) return res
    return { data: [] }
  })
  const attributes = useSelector(state => state.content.schemas.find(i => i.tableName === tableName)?.attributes) || {}

  useEffect(() => {
    if (tableName) {
      dispatch(getTableData({ tableName }))
    }
  }, [tableData.page, tableData.pageSize, tableData.sort, tableName])

  const { data } = tableData
  return (
    <Box padding={8} background='neutral100'>
      <Table
        colCount={6}
        rowCount={10}
        footer={
          <TFooter
            icon={<Plus />}
          >Add another field to this collection type
          </TFooter>
}
      >
        <Thead>
          <Tr>
            {Object.keys(attributes).map(attr => {
              return (
                <Th key={attr}>
                  <Typography variant='sigma'>{attr}</Typography>
                </Th>
              )
            })}
          </Tr>
        </Thead>
        {
          data && data.length > 0 &&
            <Tbody>
              {data.map(item => {
                return (
                  <Tr key={item.id}>
                    {
                      Object.keys(attributes).map(attr => {
                        let cell = item[attr]
                        if (typeof cell === 'object') {
                          cell = JSON.stringify(cell).slice(0, 10)
                        }

                        if (typeof cell === 'undefined') {
                          cell = ''
                        }

                        if (typeof cell === 'string' && cell.length > 16) {
                          cell = cell.slice(0, 16)
                        }

                        return (
                          <Td key={attr}>
                            {cell}
                          </Td>
                        )
                      })
                    }
                  </Tr>
                )
              })}
            </Tbody>
        }
      </Table>
    </Box>
  )
}
