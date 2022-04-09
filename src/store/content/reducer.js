import { createAction, createReducer } from 'redux-act'

const DEFAULT_TABLE_DATA = {
  sort: 'created_at:desc',
  page: 1,
  pageSize: 20,
  isLoading: false,
  count: 0,
  data: []
}

const INITIAL_STATE = {
  schemas: [],
  tableData: {},
  api: {}
}

export const getSchemas = createAction('get_schemas')
export const setSchemas = createAction('set_schemas')

export const getTableData = createAction('get_table_data')
export const setTableData = createAction('set_table_data')
export const setTablePage = createAction('set_table_page')

export const getApi = createAction('get_api')
export const setApi = createAction('set_api')

export const deleteTableItem = createAction('delete_table_item')

const contentReducer = createReducer({
  [setApi]: (state, payload) => ({
    ...state,
    api: {
      ...state.api,
      [payload.tableName]: payload.api
    }
  }),

  [setSchemas]: (state, payload) => {
    const newState = {
      ...state,
      schemas: payload.schemas
    }

    payload.schemas.forEach(schema => {
      if (!newState.tableData[schema.tableName]) {
        newState.tableData[schema.tableName] = DEFAULT_TABLE_DATA
      }

      if (!newState.api[schema.tableName]) {
        newState.api[schema.tableName] = []
      }
    })

    return newState
  },

  [getTableData]: (state, payload) => ({
    ...state,
    tableData: {
      ...state.tableData,
      [payload.tableName]: {
        ...state.tableData[payload.tableName],
        isLoading: true
      }
    }
  }),

  [setTablePage]: (state, payload) => ({
    ...state,
    tableData: {
      ...state.tableData,
      [payload.tableName]: {
        ...state.tableData[payload.tableName],
        page: payload.page
      }
    }
  }),

  [setTableData]: (state, payload) => ({
    ...state,
    tableData: {
      ...state.tableData,
      [payload.tableName]: {
        ...state.tableData[payload.tableName],
        count: payload.count,
        data: payload.data,
        isLoading: false
      }
    }
  })

}, INITIAL_STATE)

export default contentReducer
