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

  const response = await fetch(import.meta.env.VITE_API_URL + url, {
    method,
    headers,
    body: JSON.stringify(payload)
  })
  const data = await response.json()
  return data
}

const api = {
  callDapi: async (payload, jwt) => {
    const { tableName, callMethod, id, ...requestBody } = payload
    let url
    let method

    switch (callMethod) {
      case 'get':
        url = `/dapi/${tableName}/${id}`
        method = 'get'
        break
      case 'getList':
        url = `/dapi/${tableName}`
        method = 'get'
        break
      case 'create':
        url = `/dapi/${tableName}`
        method = 'post'
        break
      case 'update':
        url = `/dapi/${tableName}/${id}`
        method = 'put'
        break
      case 'delete':
        url = `/dapi/${tableName}/${id}`
        method = 'delete'
        break
      default:
        break
    }

    return await request({
      method,
      url,
      needToken: true,
      jwt,
      payload: requestBody
    })
  },

  authLocal: async (payload) => {
    return await request({
      method: 'post',
      url: '/api/auth/login/local',
      needToken: false,
      payload: {
        username: payload.username,
        password: payload.password
      }
    })
  },

  getProfile: async (jwt) => {
    return await request({
      method: 'get',
      url: '/papi/auth/profile',
      needToken: true,
      jwt
    })
  },

  getDetail: async (payload, jwt) => {
    const { id, tableName } = payload
    return await request({
      method: 'get',
      url: `/dapi/${tableName}/${id}`,
      needToken: true,
      jwt
    })
  },

  updateTableItem: async (payload, jwt) => {
    const { tableName, data } = payload
    return await request({
      method: 'put',
      url: `/dapi/${tableName}`,
      needToken: true,
      jwt,
      payload: data
    })
  },

  createTableItem: async (payload, jwt) => {
    const { tableName, data } = payload
    return await request({
      method: 'post',
      url: `/dapi/${tableName}`,
      needToken: true,
      jwt,
      payload: data
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
