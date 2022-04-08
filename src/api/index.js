import fetch from 'unfetch'

const request = async ({
  method,
  url,
  needToken,
  payload,
  jwt
}) => {
  const headers = {
    appid: 'test',
    'Content-Type': 'application/json'
  }

  if (needToken) {
    headers.Authorization = `Bearer ${jwt}`
  }

  const response = await fetch('http://localhost:3001' + url, {
    method,
    headers,
    body: JSON.stringify(payload)
  })
  const data = await response.json()
  return data
}

const api = {
  authTest: async () => {
    return await request({
      method: 'post',
      url: '/auth/login/test',
      needToken: false,
      payload: { id: 1 }
    })
  },

  getSchemas: async jwt => {
    return await request({
      method: 'get',
      url: '/dapi/schema/all',
      needToken: true,
      jwt
    })
  },

  getTableData: async (payload, jwt) => {
    const {
      page = 1,
      pageSize = 20,
      sort = 'created_at:desc'
    } = payload

    const q = new URLSearchParams({ page, pageSize, sort })
    const result = await Promise.all([
      request({
        method: 'get',
        url: `/dapi/${payload.tableName}?${q.toString()}`,
        needToken: true,
        jwt
      }),
      request({
        method: 'get',
        url: `/dapi/${payload.tableName}/count`,
        needToken: true,
        jwt
      })
    ])

    return result
  }
}

export default api
