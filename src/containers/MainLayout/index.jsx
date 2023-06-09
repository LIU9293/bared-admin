import BaredLogo from '@assets/img/2.png'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  MainNav,
  NavSection,
  NavSections,
  NavCondense,
  NavBrand,
  NavUser,
  NavLink,
  Divider
} from '@strapi/design-system'
import Layer from '@strapi/icons/Layer'
import Puzzle from '@strapi/icons/Puzzle'
import Cup from '@strapi/icons/Cup'
import FileError from '@strapi/icons/FileError'

export default function MainLayout () {
  const user = useSelector(state => state.auth.user)
  const [condensed, setCondensed] = useState(false)
  return (
    <div className='app'>
      <MainNav condensed={condensed}>
        <NavBrand
          workplace='Developer panel'
          title='Bared CMS'
          icon={<img src={BaredLogo} alt='' />}
        />
        <Divider />
        <NavSections>
          <NavSection label='Contents'>
            <NavLink to='/content' icon={<Layer />}>
              Data Tables
            </NavLink>
            <NavLink to='/content-api' icon={<Puzzle />}>
              API Viewer
            </NavLink>
            <NavLink to='/content-service' icon={<Cup />}>
              Services
            </NavLink>
            <NavLink to='/errors' icon={<FileError />}>
              Errors
            </NavLink>
          </NavSection>
        </NavSections>
        {user.name &&
          <Link to='/user'>
            <NavUser src={user.avatar}>
              {user.name}
            </NavUser>
          </Link>}
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
