import * as Actions from './actions.js'
import defaultFetch from './default-fetch.js'
import reducer from './reducer.js'

function createJarm(config) {
  const merged = {
    fetch: defaultFetch,
    schema: {},
    ...config,
    reducer,

    // jarm api - writing
    populate: function(data) {
      if (!Array.isArray(data)) {
        return Actions.populateData([data])
      }
      else {
        return Actions.populateData(data)
      }
    },
    create: function(newInstance) {},
    update: function(type, id, changes) {},
    discard: function(type, id) {},
    commit: function(type, id) {},
    save: function(type, id) {},
    purge: function(type, id) {},
    // jarm api - reading
    get: function(store, type, id) {
      let instance = merged.get_local(store, type, id)
      instance = merged.retree_remote(store, instance)
      return merged.annotate_status(store, instance)
    },
    get_local: function(store, type, id) {},
    get_remote: function(store, type, id) {},
    retree_local: function(store, instance) {},
    retree_remote: function(store, instance) {},
    annotate_status: function(store, instance) {},
  }
  merged.fetch = merged.fetch.bind(merged)
  return merged
}
export default createJarm
