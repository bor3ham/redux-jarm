function mergeInstance(instance, changes) {
  return {
    ...instance,
    attributes: {
      ...instance.attributes,
      ...changes.attributes,
    },
    relationships: {
      ...instance.relationships,
      ...changes.relationships,
    },
  }
}

function relationsMatch(rOne, rTwo) {
  // get rid of 'data' blobs with recursion
  const rOneHasData = (typeof rOne === 'object' && rOne !== null && rOne.data)
  const rTwoHasData = (typeof rTwo === 'object' && rTwo !== null && rTwo.data)
  if (rOneHasData && rTwoHasData) {
    return relationsMatch(rOne.data, rTwo.data)
  }
  else if (rOneHasData) {
    return relationsMatch(rOne.data, rTwo)
  }
  else if (rTwoHasData) {
    return relationsMatch(rOne, rTwo.data)
  }

  if (Array.isArray(rOne) && Array.isArray(rTwo)) {
    // match arrays with recursion
    if (rOne.length !== rTwo.length) {
      return false
    }
    for (var index = 0; index < rOne.length; index++) {
      if (!relationsMatch(rOne[index], rTwo[index])) {
        return false
      }
    }
    return true
  }
  else if (rOne === null && rTwo === null) {
    return true
  }
  else if (
    typeof rOne === 'object'
    && typeof rTwo === 'object'
    && rOne !== null
    && rTwo !== null
  ) {
    return rOne.type === rTwo.type && rOne.id === rTwo.id
  }
  return false
}

function matchesInstance(instance, filter) {
  if ('type' in filter && instance.type !== filter.type) {
    return false
  }
  if ('attributes' in filter) {
    for (var key in filter.attributes) {
      if ('attributes' in instance === false) {
        return false
      }
      if (instance.attributes[key] !== filter.attributes[key]) {
        return false
      }
    }
  }
  if ('relationships' in filter) {
    for (var key in filter.relationships) {
      if ('relationships' in instance === false) {
        return false
      }
      const filterRelation = filter.relationships[key]
      const instanceRelation = instance.relationships[key]
      if (!relationsMatch(instanceRelation, filterRelation)) {
        return false
      }
    }
  }
  return true
}

function filterFirst(store, filter) {
  const state = this.getJarmState(store)

  for (var instanceType in state.remote) {
    const remoteModel = state.remote[instanceType]
    const localModel = state.local[instanceType] || {}
    for (var id in remoteModel) {
      let instance = remoteModel[id]
      if (id in localModel) {
        instance = mergeInstance(instance, localModel[id])
      }
      if (matchesInstance(instance, filter)) {
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
      if (matchesInstance(instance, filter)) {
        return {
          type: instanceType,
          id,
        }
      }
    }
  }
  return null
}

function filterAll(store, filter) {
  const state = this.getJarmState(store)

  const matches = []
  for (var instanceType in state.remote) {
    const remoteModel = state.remote[instanceType]
    const localModel = state.local[instanceType] || {}
    for (var id in remoteModel) {
      let instance = remoteModel[id]
      if (id in localModel) {
        instance = mergeInstance(instance, localModel[id])
      }
      if (matchesInstance(instance, filter)) {
        matches.push({
          type: instanceType,
          id,
        })
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
      if (matchesInstance(instance, filter)) {
        matches.push({
          type: instanceType,
          id,
        })
      }
    }
  }
  return matches
}

export { filterFirst, filterAll }
