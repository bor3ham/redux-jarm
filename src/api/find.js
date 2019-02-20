function matches(instance, filter) {
  if ('type' in filter && instance.type !== filter.type) {
    return false
  }
  if ('attributes' in filter) {
    for (var key in filter.attributes) {
      if (instance.attributes[key] !== filter.attributes[key]) {
        return false
      }
    }
  }
  return true
}

function filterFind(store, filter) {
  const state = this.getJarmState(store)

  for (var instanceType in state.remote) {
    const remoteModel = state.remote[instanceType]
    const localModel = state.local[instanceType] || {}
    for (var id in remoteModel) {
      let instance = remoteModel[id]
      if (id in localModel) {
        instance = {
          ...instance,
          attributes: {
            ...instance.attributes,
            ...localModel[id].attributes,
          },
          relationships: {
            ...instance.relationships,
            ...localModel[id].relationships,
          },
        }
      }
      if (matches(instance, filter)) {
        return {
          type: instanceType,
          id,
        }
      }
    }
  }

  for (var instanceType in state.local) {
    const localModel = state.local[instanceType]
    const remoteModel = state.remote[instanceType] || {}
    for (var id in localModel) {
      if (id in remoteModel) {
        continue
      }
      let instance = localModel[id]
      if (matches(instance, filter)) {
        return {
          type: instanceType,
          id,
        }
      }
    }
  }
  return null
}
export { filterFind }

export default function(store, filter) {
  let instance = this.find_local(store, filter)
  instance = this.retree_remote(store, instance)
  return this.annotate_status(store, instance)
}

