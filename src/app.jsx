import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import ContentDataPage from '@containers/ContentDataPage'
import ContentApiPage from '@containers/ContentApiPage'
import ContentServicePage from '@containers/ContentServicePage'
import ContentDetailPage from '@containers/ContentDetailPage'
import ErrorsPage from '@containers/ErrorsPage'
import ErrorDetailPage from '@containers/ErrorsPage/ErrorDetailPage'
import LoginPage from '@containers/LoginPage'
import MainLayout from '@containers/MainLayout'
import { getProfile } from '@store/auth/reducer'

function RequireAuth ({ children }) {
  const jwt = useSelector(state => state.auth.jwt)
  const location = useLocation()

  if (!jwt) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children
}

export default function App () {
  const dispatch = useDispatch()

  useEffect(() => {
    const jwt = window.localStorage.getItem('jwt')
    if (jwt) {
      dispatch(getProfile({ jwt }))
    }
  }, [])

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/' element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
      }
      >
        <Route path='content' element={<ContentDataPage />} />
        <Route path='content/:tableName' element={<ContentDataPage />} />
        <Route path='content/:tableName/:page' element={<ContentDataPage />} />
        <Route path='content-detail/error/:id' element={<ErrorDetailPage />} />
        <Route path='content-detail/:tableName/:id' element={<ContentDetailPage />} />
        <Route path='content-api' element={<ContentApiPage />} />
        <Route path='content-api/:tableName' element={<ContentApiPage />} />
        <Route path='content-service' element={<ContentServicePage />} />
        <Route path='content-service/:serviceName' element={<ContentServicePage />} />
        <Route path='errors' element={<ErrorsPage />} />
      </Route>
    </Routes>
  )
}
