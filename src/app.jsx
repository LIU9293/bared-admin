import { useSelector, useDispatch } from 'react-redux'
import SideBar from '@components/SideBar'
import { login } from '@store/auth/reducer'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ContentTable from '@containers/ContentTable'

export default function App () {
  const user = useSelector(state => state.auth.user)
  const schemas = useSelector(state => state.content.schemas)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(login())
  }

  const handleSchemaClick = ({ tableName }) => {
    navigate(`/content/${tableName}`)
  }

  const sidebarConfig = [{
    title: 'Content Type',
    items: schemas.map(schema => ({
      title: schema.displayName || schema.tableName,
      active: false,
      onClick: () => handleSchemaClick(schema)
    }))
  }]

  return (
    <div className='app'>
      <SideBar user={user} config={sidebarConfig} onLogin={handleLogin} />
      <div className='container'>
        <div className='content'>
          <Routes>
            <Route path='/' element={<div>Homepage</div>} />
            <Route
              path='/content/:tableName'
              element={<ContentTable />}
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}
