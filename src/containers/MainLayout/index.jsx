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
          <Outlet />
        </div>
      </div>
    </div>
  )
}
