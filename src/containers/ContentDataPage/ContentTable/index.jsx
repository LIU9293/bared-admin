import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getTableData, deleteTableItem } from '@store/content/reducer'
import { VisuallyHidden } from '@strapi/design-system/VisuallyHidden'
import { IconButtonGroup, IconButton } from '@strapi/design-system/IconButton'
import { Box } from '@strapi/design-system/Box'
import { Table, TFooter, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table'
import { Typography } from '@strapi/design-system/Typography'
import Plus from '@strapi/icons/Plus'
import Pencil from '@strapi/icons/Pencil'
import Trash from '@strapi/icons/Trash'
import ConfirmModal from '@components/ConfirmModal'

export default function ContentTable () {
  const { tableName } = useParams()
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
  }, [tableName])

  const handleItemDelete = item => {
    setDeleteItem(item)
    setConfirmModalOpen(true)
  }

  const onDelete = () => {
    dispatch(deleteTableItem({ tableName, id: deleteItem.id }))
  }

  const onConfirm = () => {
    onDelete()
  }

  const handleItemUpdate = item => {
    console.log(item)
  }

  const onRowClick = item => {
    navigate(`/content-detail/${tableName}/${item.id}`)
  }

  const { data, count } = tableData
  return (
    <Box padding={8} background='neutral100'>
      <Typography variant='alpha'>{tableName}</Typography>
      <Box paddingBottom={4}>
        <Typography variant='epsilon'>{`${count} items found.`}</Typography>
      </Box>
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
            {['id'].concat(Object.keys(attributes)).map(attr => {
              return (
                <Th key={attr}>
                  <Typography variant='sigma'>{attr}</Typography>
                </Th>
              )
            })}
            <Th><VisuallyHidden>Actions</VisuallyHidden></Th>
          </Tr>
        </Thead>
        {
          data && data.length > 0 &&
            <Tbody>
              {data.map(item => {
                return (
                  <Tr key={item.id}>
                    {
                      ['id'].concat(Object.keys(attributes)).map(attr => {
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
                          <Td key={attr} onClick={() => onRowClick(item)} className='pointer'>
                            {cell}
                          </Td>
                        )
                      })
                    }
                    <Td>
                      <IconButtonGroup>
                        <IconButton onClick={() => handleItemUpdate(item)} label='Edit' icon={<Pencil />} />
                        <IconButton onClick={() => handleItemDelete(item)} label='Delete' icon={<Trash />} />
                      </IconButtonGroup>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
        }
      </Table>
      <ConfirmModal
        show={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
      />
    </Box>
  )
}
