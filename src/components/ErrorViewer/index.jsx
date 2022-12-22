/* eslint-disable camelcase */
import ReactJson from 'react-json-view'
import dayjs from 'dayjs'
import {
  Box,
  Flex,
  Button,
  Typography,
  Card,
  CardContent,
  CardTitle,
  CardSubtitle
} from '@strapi/design-system'
import styled from 'styled-components'

const ErrorViewerContainer = styled(Card)`
  padding: 24px;
  display: flex;
  flex-direction: column;
`

const StackTrace = styled.div`
  font-family: monospace;
  margin-top: 12px;
`

export default function ErrorViewer ({
  id,
  created_at,
  user_id,
  code, // 400
  url, // /api/ping
  method, // post
  message,
  error_trace,
  raw_request,
  onCancel,
  onDelete
}) {
  return (
    <ErrorViewerContainer>
      <Box paddingBottom={4}>
        <Typography variant='alpha'>{`Error - ID ${id}`}</Typography>
      </Box>
      <CardContent>
        <CardTitle>{`Error - ${message}`}</CardTitle>
        <CardSubtitle>{`${method} - ${url} - HTTP code: ${code}`}</CardSubtitle>
      </CardContent>
      <Box paddingTop={4}>
        {created_at &&
          <Typography variant='omega'>{dayjs(created_at).format('MMMM D, YYYY h:mm A')}</Typography>}
      </Box>
      {
        error_trace &&
          <Box paddingBottom={4} paddingTop={8}>
            <Typography variant='delta'>Stack Trace</Typography>
            <StackTrace>
              {error_trace
                .split('\n')
                .map((text, idx) => (
                  <p key={idx} style={{ marginLeft: idx === 0 ? 0 : 16 }}>{text}</p>
                ))}
            </StackTrace>
          </Box>
      }
      {
        raw_request &&
          <Box paddingBottom={4} paddingTop={8}>
            <Typography variant='delta'>Request Context</Typography>
            <ReactJson src={raw_request} name={false} style={{ marginTop: 12 }} />
          </Box>
      }

      <Box paddingTop={4}>
        <Flex justifyContent='flex-end'>
          <Button
            variant='danger'
            onClick={onDelete}
          >
            Delete
          </Button>
          <Button
            variant='tertiary'
            style={{ marginLeft: 12 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Flex>
      </Box>
    </ErrorViewerContainer>
  )
}
