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
import { groupBy } from 'ramda'
import ContentTable from './ContentTable'

const ContentPageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row
`

const ContentPageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  max-height: 100vh;
  overflow-y: auto;
`

export default function ContentDataPage () {
  const { tableName } = useParams()
  const schemas = useSelector(state => state.content.schemas)

  const userSchemas = schemas.filter(schema => !schema.pluginName && schema.tableName !== 'error') || []
  const grouiedPluginSchemas = groupBy(a => a.pluginName, schemas.filter(i => !!i.pluginName)) || []
  return (
    <ContentPageContainer>
      <SubNav className='subnav' ariaLabel='Builder sub nav'>
        <SubNavHeader label='App数据表' />
        <SubNavSections style={{ marginBottom: -10 }}>
          {userSchemas.map(schema =>
            <SubNavLink
              to={`/content/${schema.tableName}`}
              key={schema.tableName}
            >
              {schema.displayName || schema.tableName}
            </SubNavLink>
          )}
        </SubNavSections>
        <SubNavHeader label='Plugin数据表' />
        {Object.keys(grouiedPluginSchemas).map(key => {
          return (
            <SubNavSections key={key} style={{ marginBottom: -10 }}>
              <SubNavSection label={key}>
                {grouiedPluginSchemas[key]
                  .map(schema =>
                    <SubNavLink
                      to={`/content/${schema.tableName}`}
                      key={schema.tableName}
                    >
                      {schema.displayName || schema.tableName}
                    </SubNavLink>
                  )}
              </SubNavSection>
            </SubNavSections>
          )
        })}
      </SubNav>
      <ContentPageContent>
        {tableName && <ContentTable />}
      </ContentPageContent>
    </ContentPageContainer>
  )
}
