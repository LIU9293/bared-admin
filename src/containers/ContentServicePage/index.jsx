import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink
} from '@strapi/design-system/SubNav'
import styled from 'styled-components'
import { getService } from '@store/content/reducer'
import { groupBy, pipe, filter } from 'ramda'
import ServiceDetail from './ServiceDetail'

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

export default function ContentServicePage () {
  const { serviceName } = useParams()
  const services = useSelector(state => state.content.services)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getService())
  }, [])

  const grouiedPluginServices = pipe(
    filter(service => !!service.pluginName),
    groupBy(a => a.pluginName)
  )(services)

  const grouiedAppServices = pipe(
    filter(service => !!service.groupName),
    groupBy(a => a.groupName)
  )(services)

  return (
    <ContentPageContainer>
      <SubNav className='subnav' ariaLabel='sub-nav'>
        <SubNavHeader label='App Services' />
        {Object.keys(grouiedAppServices).map(key => {
          return (
            <SubNavSections key={key} style={{ marginBottom: -10 }}>
              <SubNavSection label={key}>
                {grouiedAppServices[key]
                  .filter(i => i.showInAdmin)
                  .map(service =>
                    <SubNavLink
                      to={`/content-service/${service.name}`}
                      key={service.name}
                    >
                      {service.name}
                    </SubNavLink>
                  )}
              </SubNavSection>
            </SubNavSections>
          )
        })}
        <SubNavHeader label='Plugin Services' />
        {Object.keys(grouiedPluginServices).map(key => {
          return (
            <SubNavSections key={key} style={{ marginBottom: -10 }}>
              <SubNavSection label={key}>
                {grouiedPluginServices[key]
                  .map(service => (
                    <SubNavLink to={`/content-service/${service.name}`} key={service.name}>
                      {service.name}
                    </SubNavLink>
                  ))}
              </SubNavSection>
            </SubNavSections>
          )
        })}
      </SubNav>
      <ContentPageContent>
        {serviceName && <ServiceDetail />}
      </ContentPageContent>
    </ContentPageContainer>
  )
}
