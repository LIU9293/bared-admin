import styled from 'styled-components'
import Geometry from '@assets/img/geometry.png'

export const LoginBackground = styled.div`
  background-image: url(${Geometry});
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 32px;
  border-radius: 4px;

  input {
    min-width: 260px;
  }
`
