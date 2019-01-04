import * as ReducerActions from './reducer-actions.js'
import * as AsyncActions from './async-actions.js'
import defaultFetch from './default-fetch.js'
import reducer from './reducer.js'
import * as api from './api'

// schema:
// {
//   modelType: {
//     url: 'tasks/',
//     newTemplate: {},
//   },
// }

function createJarm(config) {
  const merged = {
    fetch: defaultFetch,
    schema: {},
    statusKey: '__status',
    ...config,
    reducer,
  }
  merged.fetch = merged.fetch.bind(merged)
  for (let method in api) {
    merged[method] = api[method].bind(merged)
  }
  return merged
}
export default createJarm
