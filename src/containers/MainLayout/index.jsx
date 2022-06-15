import BaredLogo from '@assets/img/2.png'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Divider } from '@strapi/design-system/Divider'
import {
  MainNav,
  NavSection,
  NavSections,
  NavCondense,
  NavBrand,
  NavUser,
  NavLink
} from '@strapi/design-system/MainNav'
import Layer from '@strapi/icons/Layer'
import Puzzle from '@strapi/icons/Puzzle'
import FileError from '@strapi/icons/FileError'

export default function MainLayout () {
  const user = useSelector(state => state.auth.user)
  const [condensed, setCondensed] = useState(false)
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
              数据视图
            </NavLink>
            <NavLink to='/content-api' icon={<Puzzle />}>
              API列表
            </NavLink>
            <NavLink to='/errors' icon={<FileError />}>
              Errors
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}
