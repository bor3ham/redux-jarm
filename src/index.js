import * as Actions from './actions.js'

function defaultFetch(url, config={}, data={}) {
  return (dispatch, getState) => {
    if (!this.baseUrl) {
      throw 'No base url defined'
    }
    return fetch(url, {
      ...config,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        ...config.headers,
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status >= 400 && response.status < 600) {
        throw(response)
      }
      if (typeof response.json === 'function') {
        return response.json().then((parsedResponse) => {
          if ('data' in parsedResponse) {
            dispatch(this.populate(parsedResponse.data))
          }
          if ('included' in parsedResponse) {
            dispatch(this.populate(parsedResponse.included))
          }
          return {
            ...response,
            data: parsedResponse,
          }
        }).catch((parseError) => {
          return {
            ...response,
            data: {},
          }
        })
      }
      else {
        return {
          ...response,
          data: {},
        }
      }
    }).catch((error) => {
      if (typeof error.json === 'function') {
        return error.json().catch((parseError) => {
          throw({
            ...error,
            data: {},
          })
        }).then((parsedError) => {
          throw({
            ...error,
            data: parsedError,
          })
        })
      }
      else {
        throw({
          ...error,
          data: {},
        })
      }
    })
  }
}

function defaultReducer(state={
  remote: {},
  local: {},
}, action) {
  switch(action.type) {
    case Actions.Keys.populateData: {
      let newState = {
        ...state,
        remote: {
          ...state.remote,
        },
      }
      action.data.map((item) => {
        newState.remote[item.type] = {
          ...newState.remote[item.type],
        }
        newState.remote[item.type][item.id] = item
      })
      return newState
    }
    default:
      return state
  }
}

function createJarm(config) {
  const merged = {
    fetch: defaultFetch,
    ...config,
    reducer: defaultReducer,

    // jarm api
    populate: function(data) {
      if (!Array.isArray(data)) {
        return Actions.populateData([data])
      }
      else {
        return Actions.populateData(data)
      }
    },
  }
  merged.fetch = merged.fetch.bind(merged)
  return merged
}
export default createJarm
