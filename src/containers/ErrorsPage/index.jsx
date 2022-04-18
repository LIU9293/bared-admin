import styled from 'styled-components'
import ContentTable from '../ContentDataPage/ContentTable'

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
  return (
    <ContentPageContainer>
      <ContentPageContent>
        <ContentTable table='error' />
      </ContentPageContent>
    </ContentPageContainer>
  )
}
