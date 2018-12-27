import * as ReducerActions from './reducer-actions.js'
import * as AsyncActions from './async-actions.js'
import defaultFetch from './default-fetch.js'
import reducer from './reducer.js'

function createJarm(config) {
  const merged = {
    fetch: defaultFetch,
    schema: {},
    statusKey: '__status',
    ...config,
    reducer,

    // jarm api - writing
    populate: function(data) {
      if (!Array.isArray(data)) {
        return ReducerActions.setRemoteData([data])
      }
      else {
        return ReducerActions.setRemoteData(data)
      }
    },
    create: function(newFields) {
      if ('type' in newFields === false) {
        throw('No type in instance')
      }
      const template = (this.schema[newFields.type] || {}).newTemplate || {}
      const newInstance = {
        ...template,
        ...newFields,
        attributes: {
          ...template.attributes,
          ...newFields.attributes,
        },
        relationships: {
          ...template.relationships,
          ...newFields.relationships,
        },
      }
      return AsyncActions.create(newInstance)
    },
    update: function(type, id, changes) {
      return ReducerActions.extendLocalInstance(type, id, changes)
    },
    discard: function(type, id) {},
    delete: function(type, id) {},
    commit: function(type, id) {
      return ReducerActions.commitLocalInstance(type, id)
    },
    save: function(type, id) {},
    // jarm api - reading
    get: function(store, type, id) {
      let instance = merged.get_local(store, type, id)
      instance = merged.retree_remote(store, instance)
      return merged.annotate_status(store, instance)
    },
    get_local: function(store, type, id) {},
    get_remote: function(store, type, id) {},
    get_error: function(store, type, id) {},
    annotate_status: function(store, instance) {
      if (instance === null) {
        return instance
      }
      if (!instance.type) {
        throw('No type in instance')
      }
      if (!instance.id) {
        throw('No id in instance')
      }
      const instanceKey = `${instance.type}-${instance.id}`
      const state = store.getState()
      const local = state.local[instance.type] || {}
      const remote = state.remote[instance.type] || {}
      const isCommitted = !!state.committed[instanceKey]
      const isPending = !!state.pending[instanceKey]
      const isNew = !!state.new[instanceKey]
      let status = 'unchanged'
      if (local[instance.id]) {
        if (isNew) {
          if (isPending) {
            status = 'draft-pending'
          }
          else if (isCommitted) {
            status = 'draft-committed'
          }
          else {
            status = 'draft'
          }
        }
        else {
          if (isPending) {
            status = 'modified-pending'
          }
          else if (isCommitted) {
            status = 'modified-committed'
          }
          else {
            status = 'modified'
          }
        }
        // todo: add deleted states
      }
      return {
        ...instance,
        [this.statusKey]: status,
      }
    },
    retree_local: function(store, instance) {},
    retree_remote: function(store, instance) {},
  }
  merged.fetch = merged.fetch.bind(merged)
  merged.populate = merged.populate.bind(merged)
  merged.create = merged.create.bind(merged)
  merged.annotate_status = merged.annotate_status.bind(merged)
  return merged
}
export default createJarm
