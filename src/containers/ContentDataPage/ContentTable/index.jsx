import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getTableData, deleteTableItem } from '@store/content/reducer'
import { IconButtonGroup, IconButton, Table, TFooter, Thead, Tbody, Tr, Td, Th, Typography, Select, Option, Button, Flex, Box, VisuallyHidden, NextLink, Pagination, PreviousLink } from '@strapi/design-system'
import Plus from '@strapi/icons/Plus'
import Pencil from '@strapi/icons/Pencil'
import Trash from '@strapi/icons/Trash'
import CarretDown from '@strapi/icons/CarretDown'
import CarretUp from '@strapi/icons/CarretUp'
import Magic from '@strapi/icons/Magic'
import { request } from '@api'
import ConfirmModal from '@components/ConfirmModal'
import ServiceModal from '@components/ServiceModal'
import Avatar from '@components/Avatar'
import ReactJson from 'react-json-view'
import DynamicInput from '@components/DynamicInput'

const pageSize = 20

export default function ContentTable ({ table }) {
  const { tableName = table, page = 1 } = useParams()
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const [enableFilter, setEnableFilter] = useState(false)
  const [filterKey, setFilterKey] = useState(null)
  const [filterValue, setFilterValue] = useState(null)

  const [deleteItem, setDeleteItem] = useState({})
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('desc')

  const [visibleColumns, setVisibleColumns] = useState([])
  const [allColumns, setAllColumns] = useState([])
  const [filterColumns, setFilterColumns] = useState([])

  const [services, setSerivces] = useState([])
  const [serviceModal, setServiceModal] = useState(false)
  const [responseContent, setResponseContent] = useState({})
  const [responseModal, setResponseModal] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const jwt = useSelector(state => state.auth.jwt)
  const tableData = useSelector(state => {
    const res = state.content.tableData[tableName]
    if (res && res.data) return res
    return { data: [] }
  })

  const attributes = useSelector(state =>
    state.content.schemas
      .find(i => i.tableName === tableName)?.attributes
  ) || {}

  const rowActions = useSelector(state =>
    state.content.schemas
      .find(i => i.tableName === tableName)?.rowActions
  ) || []

  const onSetColumns = cols => {
    if (cols.length === 0) {
      return
    }

    setVisibleColumns(cols)
    try {
      let tableConfig = window.localStorage.getItem('bared-admin-table-config')
      if (tableConfig) {
        tableConfig = JSON.parse(tableConfig)
        tableConfig[tableName] = cols
        window.localStorage.setItem('bared-admin-table-config', JSON.stringify(tableConfig))
      } else {
        window.localStorage.setItem('bared-admin-table-config', JSON.stringify({
          [tableName]: cols
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setColumnToDefault = () => {
    let visible = ['id', 'created_at']

    const tableConfig = window.localStorage.getItem('bared-admin-table-config')
    if (tableConfig && JSON.parse(tableConfig)[tableName]) {
      visible = JSON.parse(tableConfig)[tableName]
    } else {
      for (const i in attributes) {
        if (attributes[i].tableConfig?.defaultShow) {
          visible.push(i)
        }
      }
    }

    const cols = Object.keys(attributes)
    const filterCols = ['id']
    cols.forEach(col => {
      if (['integer', 'string'].indexOf(attributes[col].type) >= 0) {
        filterCols.push(col)
      }
    })

    setVisibleColumns(visible)
    setAllColumns(['id', 'created_at'].concat(Object.keys(attributes)))
    setFilterColumns(filterCols)
  }

  useEffect(() => {
    setColumnToDefault()
  }, [attributes, tableName])

  useEffect(() => {
    setSortKey('id')
    setSortDirection('desc')
  }, [tableName])

  useEffect(() => {
    if (tableName) {
      const params = {
        tableName,
        page: parseInt(page),
        pageSize,
        sortKey,
        sortDirection
      }

      dispatch(getTableData(enableFilter
        ? { ...params, filterKey, filterValue }
        : params))
    }
    // TODO: fix table change but sortKey out of range in next table
  }, [tableName, page, sortKey, sortDirection])

  const handleItemDelete = item => {
    setDeleteItem(item)
    setConfirmModalOpen(true)
  }

  const openActionsControl = (rowActions, item) => {
    const services = rowActions.map(action => {
      const { paramsMap = {}, fixedParams = {} } = action

      action.params = { ...fixedParams }

      const paramsMapKeys = Object.keys(paramsMap) || []
      if (paramsMapKeys.length > 0) {
        paramsMapKeys.forEach(key => {
          action.params[key] = item[paramsMap[key]]
        })
      }

      return action
    })

    setSerivces(services)
    setServiceModal(true)
  }

  const onServiceCall = service => {
    setServiceModal(false)
    setResponseContent({})
    const { serviceName, params } = service

    request({
      method: 'post',
      url: `/dapi/service/${serviceName.toLowerCase()}`,
      needToken: true,
      jwt,
      payload: params
    })
      .then(response => {
        setResponseContent(response)
        setResponseModal(true)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onDelete = () => {
    dispatch(deleteTableItem({ tableName, id: deleteItem.id }))
  }

  const onConfirm = () => {
    setConfirmModalOpen(false)
    onDelete()
  }

  const onAddClick = () => {
    navigate(`/content-detail/${tableName}/add`)
  }

  const onRowClick = item => {
    navigate(`/content-detail/${tableName}/${item.id}`)
  }

  const onSortClick = attr => {
    if (sortKey === attr) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(attr)
    }
  }

  const onSetFilterKey = col => {
    setEnableFilter(false)
    setFilterKey(col)
  }

  const onFilterValueChange = e => {
    setFilterValue(e)
  }

  const clearFilter = () => {
    setEnableFilter(false)
    setFilterKey(null)
    setFilterValue(null)
    const params = {
      tableName,
      page: parseInt(page),
      pageSize,
      sortKey,
      sortDirection
    }

    dispatch(getTableData(params))
  }

  const onApplyFilter = () => {
    setEnableFilter(true)

    const params = {
      tableName,
      page: parseInt(page),
      pageSize,
      sortKey,
      sortDirection
    }

    dispatch(getTableData({ ...params, filterKey, filterValue }))
  }

  const { data, count } = tableData
  const isFirstPage = parseInt(page) === 1
  const isLastPage = parseInt(page) === Math.ceil(count / pageSize)

  console.log(page)
  return (
    <Box padding={8} background='neutral100'>
      <Typography variant='alpha'>{tableName.toUpperCase()}</Typography>

      <Box paddingBottom={4}>
        <Typography variant='epsilon'>{`${count} items found.`}</Typography>
      </Box>

      <Box paddingBottom={4}>
        <Select
          label='Columns'
          placeholder='Choose columns to show'
          value={visibleColumns}
          onChange={onSetColumns}
          multi
          withTags
        >
          {allColumns.map(item => <Option key={table + '_' + item} value={item}>{item}</Option>)}
        </Select>
      </Box>

      <Box paddingBottom={4}>
        <Box paddingBottom={2}>
          <Typography variant='pi' fontWeight='bold'>Filters</Typography>
        </Box>

        <Flex>
          <Select
            placeholder='Choose columns to filter'
            value={filterKey}
            onChange={onSetFilterKey}
          >
            {filterColumns.map(item => <Option key={table + '_' + item} value={item}>{item}</Option>)}
          </Select>
          {
            filterKey && attributes[filterKey] &&
              <Box paddingLeft={4} paddingRight={4}>=</Box>
          }
          {
            filterKey && attributes[filterKey] &&
              <DynamicInput
                name={filterKey}
                value={filterValue}
                onValueChange={onFilterValueChange}
                type={attributes[filterKey].type}
              />
          }
          {
            filterKey && attributes[filterKey] &&
              <>
                <Box paddingLeft={4}>
                  <Button onClick={onApplyFilter}>
                    Confirm
                  </Button>
                </Box>
                <Box paddingLeft={4}>
                  <Button onClick={clearFilter} variant='tertiary'>
                    Cancel
                  </Button>
                </Box>
              </>
          }
        </Flex>
      </Box>

      <Flex justifyContent='space-between'>
        <Typography variant='epsilon'>{`Showing ${((page - 1) * pageSize) + 1} - ${(page * pageSize)} items`}</Typography>
        <Pagination activePage={parseInt(page)} pageCount={Math.ceil(count / pageSize)}>
          {
            !isFirstPage &&
              <PreviousLink to={`/content/${tableName}/${parseInt(page) - 1}`}>Previous</PreviousLink>
          }
          {
            !isLastPage &&
              <NextLink to={`/content/${tableName}/${parseInt(page) + 1}`}>Next</NextLink>
          }
        </Pagination>
      </Flex>

      <Table
        colCount={6}
        rowCount={10}
        footer={(
          <TFooter icon={<Plus />} onClick={onAddClick}>
            Add another field to this data type
          </TFooter>
        )}
      >
        <Thead>
          <Tr>
            {visibleColumns.map(attr => {
              return (
                <Th
                  key={attr}
                  action={<IconButton icon={sortKey === attr ? (sortDirection === 'desc' ? <CarretDown /> : <CarretUp />) : <div />} noBorder />}
                  onClick={() => onSortClick(attr)}
                  className='pointer'
                >
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
                      visibleColumns.map(attr => {
                        const attrSetting = attributes[attr]
                        let cell = item[attr]
                        if (cell && typeof cell === 'object') {
                          cell = JSON.stringify(cell).slice(0, 10) + '...'
                        }

                        if (typeof cell === 'undefined') {
                          cell = ''
                        }

                        if (attrSetting?.tableConfig?.showAsAvatar && cell) {
                          return (
                            <Td key={attr} onClick={() => onRowClick(item)} className='pointer'>
                              <Avatar src={cell} alt='table-avatar' />
                            </Td>
                          )
                        }

                        if (typeof cell === 'string' && cell.length > 16) {
                          cell = cell.slice(0, 16) + '...'
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
                        <IconButton onClick={() => onRowClick(item)} label='Edit' icon={<Pencil />} />
                        <IconButton onClick={() => handleItemDelete(item)} label='Delete' icon={<Trash />} />
                        {
                          rowActions && rowActions.length > 0 &&
                            <IconButton onClick={() => openActionsControl(rowActions, item)} label='Actions' icon={<Magic />} />
                        }
                      </IconButtonGroup>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
        }
      </Table>
      <Flex justifyContent='flex-end' paddingBottom={4} paddingTop={4}>
        <Pagination activePage={parseInt(page)} pageCount={Math.ceil(count / pageSize)}>
          {
            !isFirstPage &&
              <PreviousLink to={`/content/${tableName}/${parseInt(page) - 1}`}>Previous</PreviousLink>
          }
          {
            !isLastPage &&
              <NextLink to={`/content/${tableName}/${parseInt(page) + 1}`}>Next</NextLink>
          }
        </Pagination>
      </Flex>

      <ConfirmModal
        show={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
      />
      <ServiceModal
        show={serviceModal}
        onCancel={() => setServiceModal(false)}
        services={services}
        onServiceCall={onServiceCall}
      />
      <ConfirmModal
        hideCancel
        show={responseModal}
        ContentComponent={(
          <Box>
            <Typography variant='delta'>Service Result</Typography>
            <ReactJson src={responseContent} name={false} style={{ marginTop: 12 }} />
          </Box>
        )}
        onCancel={() => setResponseModal(false)}
        onConfirm={() => setResponseModal(false)}
      />
    </Box>
  )
}
