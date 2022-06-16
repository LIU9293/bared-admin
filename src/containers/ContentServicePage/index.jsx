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

  return (
    <ContentPageContainer>
      <SubNav ariaLabel='Builder sub nav'>
        <SubNavHeader label='View Services' />
        <SubNavSections>
          <SubNavSection label='Plugin Services'>
            {services
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
      </SubNav>
      <ContentPageContent>
        {serviceName && <ServiceDetail />}
      </ContentPageContent>
    </ContentPageContainer>
  )
}
