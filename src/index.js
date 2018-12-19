import * as Actions from './actions.js'
import defaultFetch from './default-fetch.js'
import reducer from './reducer.js'

function createJarm(config) {
  const merged = {
    fetch: defaultFetch,
    ...config,
    reducer,

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
