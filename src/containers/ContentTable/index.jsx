import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Table from 'rc-table'
import { getTableData } from '@store/content/reducer'

export default function ContentTable () {
  const { tableName } = useParams()
  const dispatch = useDispatch()
  const tableData = useSelector(state => state.content.tableData[tableName])
  const attributes = useSelector(state => state.content.schemas.find(i => i.tableName === tableName).attributes)

  const columns = Object.keys(attributes).map(attr => ({
    title: attr,
    dataIndex: attr,
    key: attr
  }))

  const dataSource = tableData.data.map(item => {
    const obj = { key: item.id }
    columns.forEach(col => {
      let d = item[col.dataIndex]

      if (typeof d === 'object') {
        d = JSON.stringify(d)
      }

      obj[col.dataIndex] = d || ''
    })
    return obj
  })

  useEffect(() => {
    dispatch(getTableData({ tableName }))
  }, [tableData.page, tableData.pageSize, tableData.sort, tableName])

  return (
    <Table data={dataSource} columns={columns} />
  )
}
