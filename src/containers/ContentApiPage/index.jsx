import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavLink
} from '@strapi/design-system'
import styled from 'styled-components'
import ContentApi from './ContentApi'

const ContentPageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row
`

const ContentPageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export default function ContentApiPage () {
  const { tableName } = useParams()
  const routers = useSelector(state => state.api.routers)

  return (
    <ContentPageContainer>
      <SubNav ariaLabel='Builder sub nav'>
        <SubNavHeader label='Application API' />
        <SubNavSections style={{ marginBottom: -10 }}>
          {routers.filter(i => !i.pluginName).map(route => {
            return (
              <SubNavLink
                to={`/content-api/${route.name}`}
                key={route.name}
              >
                {route.name}
              </SubNavLink>
            )
          })}
        </SubNavSections>
        <SubNavHeader label='Plugin API' />
        <SubNavSections style={{ marginBottom: -10 }}>
          {routers.filter(i => !!i.pluginName).map(route => {
            return (
              <SubNavLink
                to={`/content-api/${route.name}`}
                key={route.name}
              >
                {route.name}
              </SubNavLink>
            )
          })}
        </SubNavSections>

      </SubNav>
      <ContentPageContent>
        {tableName && <ContentApi />}
      </ContentPageContent>
    </ContentPageContainer>
  )
}
