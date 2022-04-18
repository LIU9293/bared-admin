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
  const schemas = useSelector(state => state.content.schemas)
  return (
    <ContentPageContainer>
      <SubNav ariaLabel='Builder sub nav'>
        <SubNavHeader label='View Contents' />
        <SubNavSections>
          <SubNavSection label='Data'>
            {schemas.filter(i => !i.hideInAdmin).map(schema =>
              <SubNavLink
                to={`/content-api/${schema.tableName}`}
                key={schema.tableName}
              >
                {schema.displayName || schema.tableName}
              </SubNavLink>
            )}
          </SubNavSection>
        </SubNavSections>
      </SubNav>
      <ContentPageContent>
        {tableName && <ContentApi />}
      </ContentPageContent>
    </ContentPageContainer>
  )
}
