import defaultFetch from './default-fetch.js'
import defaultIsDeleted from './default-is-deleted.js'
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
    onNewId: function(oldId, newId) {
      return (dispatch, getState) => {
        console.warn(oldId, newId, 'Updated in Jarm Cache, but no handler given')
      }
    },
    isDeleted: defaultIsDeleted,
    schema: {},
    getJarmState: function(store) {
      if (this.storeKey) {
        return store[this.storeKey]
      }
      return store
    },
    statusKey: '__status',
    getPersistConfig: function(storage) {
      return {
        key: this.storeKey,
        storage,
        timeout: 10 * 1000,
        blacklist: [
          'pending',
          'errors',
        ],
      }
    },
    ...config,
    reducer,
  }
  merged.onNewId = merged.onNewId.bind(merged)
  merged.fetch = merged.fetch.bind(merged)
  merged.isDeleted = merged.isDeleted.bind(merged)
  merged.getJarmState = merged.getJarmState.bind(merged)
  merged.getPersistConfig = merged.getPersistConfig.bind(merged)
  for (let method in api) {
    if (typeof api[method] !== 'function') {
      continue
    }
    merged[method] = api[method].bind(merged)
  }
  return merged
}

export { createJarm, defaultFetch }
