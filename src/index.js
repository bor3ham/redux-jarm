import * as Actions from './actions.js'

function defaultFetch(url, config) {
  if (!this.baseUrl) {
    throw 'No base url defined'
  }
  return fetch(url, config)
}

function defaultReducer(state={
  'hi': 'there',
}, action) {
  switch(action.type) {
    case Actions.Keys.populateData:
      return {
        ...state,
        'data': 'populated',
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
