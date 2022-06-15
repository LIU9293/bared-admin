import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink
} from '@strapi/design-system/SubNav'
import styled from 'styled-components'
import ContentService from './ContentService'

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
  const { tableName } = useParams()
  const schemas = useSelector(state => state.content.schemas)
  return (
    <ContentPageContainer>
      <SubNav ariaLabel='Builder sub nav'>
        <SubNavHeader label='View Contents' />
        <SubNavSections>
          <SubNavSection label='Application API'>
            {schemas
              .filter(i => !i.hideInAdmin)
              .filter(i => !i.isPluginSchema)
              .map(schema =>
                <SubNavLink
                  to={`/content-api/${schema.tableName}`}
                  key={schema.tableName}
                >
                  {schema.displayName || schema.tableName}
                </SubNavLink>
              )}
          </SubNavSection>
          <SubNavSection label='Plugin API'>
            {schemas
              .filter(i => !i.hideInAdmin)
              .filter(i => i.isPluginSchema)
              .map(schema =>
                <SubNavLink
                  to={`/content-serivce/${schema.tableName}`}
                  key={schema.tableName}
                >
                  {schema.displayName || schema.tableName}
                </SubNavLink>
              )}
          </SubNavSection>
        </SubNavSections>
      </SubNav>
      <ContentPageContent>
        {tableName && <ContentService />}
      </ContentPageContent>
    </ContentPageContainer>
  )
}
