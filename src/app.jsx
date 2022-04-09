import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '@store/auth/reducer'
import { Routes, Route } from 'react-router-dom'
import ContentDataPage from '@containers/ContentDataPage'
import ContentApiPage from '@containers/ContentApiPage'
import ContentDetailPage from '@containers/ContentDetailPage'
import {
  MainNav,
  NavSection,
  NavSections,
  NavCondense,
  NavBrand,
  NavUser,
  NavLink
} from '@strapi/design-system/MainNav'
import { Divider } from '@strapi/design-system/Divider'
import Layer from '@strapi/icons/Layer'
import Puzzle from '@strapi/icons/Puzzle'
import BaredLogo from '@assets/img/2.png'

export default function App () {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const [condensed, setCondensed] = useState(false)

  useEffect(() => {
    dispatch(login())
  }, [])

  return (
    <div className='app'>
      <MainNav condensed={condensed}>
        <NavBrand
          workplace='Workplace'
          title='Bared CMS'
          icon={<img src={BaredLogo} alt='' />}
        />
        <Divider />
        <NavSections>
          <NavSection label='Contents'>
            <NavLink to='/content' icon={<Layer />}>
              Content
            </NavLink>
            <NavLink to='/content-api' icon={<Puzzle />}>
              Content API
            </NavLink>
          </NavSection>
        </NavSections>
        {user.name &&
          <NavUser src={user.avatar} to='/'>
            {user.name}
          </NavUser>}
        <NavCondense onClick={() => setCondensed(s => !s)}>
          {condensed ? 'Expanded the navbar' : 'Collapse the navbar'}
        </NavCondense>
      </MainNav>
      <div className='container'>
        <div className='content'>
          <Routes>
            <Route path='/' element={(<div>homepage</div>)} />
            <Route path='/content' element={<ContentDataPage />} />
            <Route path='/content/:tableName' element={<ContentDataPage />} />
            <Route path='/content-detail/:tableName/:id' element={<ContentDetailPage />} />
            <Route path='/content-api' element={<ContentApiPage />} />
            <Route path='/content-api/:tableName' element={<ContentApiPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
