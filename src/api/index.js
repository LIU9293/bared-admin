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

  try {
    const response = await fetch('https://bared-cms-1804794-1311017114.ap-shanghai.run.tcloudbase.com' + url, {
      method,
      headers,
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error.message)
    return null
  }
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

  deleteTableItem: async (payload, jwt) => {
    const { tableName, id } = payload

    if (tableName === 'user' && id === 1) {
      window.alert('Cannot delete root user')
      return
    }

    return await request({
      method: 'delete',
      url: `/dapi/${tableName}/${id}`,
      needToken: true,
      jwt
    })
  },

  getApi: async (payload, jwt) => {
    const { tableName } = payload
    return await request({
      method: 'get',
      url: `/dapi/routes/${tableName}`,
      needToken: true,
      jwt
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
