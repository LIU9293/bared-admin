import fetch from 'unfetch'

export const request = async ({
  method,
  url,
  needToken = false,
  payload,
  jwt,
  endpoint
}) => {
  const headers = {
    appid: 'test',
    'Content-Type': 'application/json'
  }

  if (needToken) {
    headers.Authorization = `Bearer ${jwt}`
  }

  const endpointFromStorage = window.localStorage.getItem('endpoint')
  const response = await fetch((endpoint || endpointFromStorage) + url, {
    method,
    headers,
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const body = await response.text()
    return {
      success: false,
      code: response.status,
      text: response.statusText,
      message: body
    }
  }

  const data = await response.json()
  return data
}

const api = {
  getAllRouters: async (payload, jwt) => {
    return await request({
      method: 'get',
      url: '/dapi/routers/all',
      needToken: true,
      jwt
    })
  },

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

  getProfile: async ({ jwt, endpoint }) => {
    return await request({
      method: 'get',
      url: '/papi/auth/profile',
      needToken: true,
      jwt,
      endpoint
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

  getService: async (payload, jwt) => {
    return await request({
      method: 'get',
      url: '/dapi/service/all',
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
      sortKey = 'id',
      sortDirection = 'desc',
      filterKey = '',
      filterValue = ''
    } = payload

    const _start = (page - 1) * pageSize
    const _limit = pageSize

    const params = {
      _start,
      _limit,
      _sort: `${sortKey}:${sortDirection}`
    }

    const countPamras = {}
    if (filterKey && filterValue) {
      params[`${filterKey}~eq`] = filterValue
      countPamras[`${filterKey}~eq`] = filterValue
    }

    const q = new URLSearchParams(params)
    const q2 = new URLSearchParams(countPamras)

    const result = await Promise.all([
      request({
        method: 'get',
        url: `/dapi/${payload.tableName}?${q.toString()}`,
        needToken: true,
        jwt
      }),
      request({
        method: 'get',
        url: `/dapi/${payload.tableName}/count?${q2.toString()}`,
        needToken: true,
        jwt
      })
    ])

    return result
  }
}

export default api
