// Given a filter, returns all matching pointers

// filter: {
//   id: undefined/id,
//   type: undefined/type,
//   modified: undefined/true/false,
//   new: undefined/true/false,
//   committed: undefined/true/false,
//   pending: undefined/true/false,
//   attributes: undefined/{
//     key: value,
//   },
//   relationships: undefined/{
//     key: value,
//   },
// }

import { instanceKey } from '../../utils.js'

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

export default function(store, filter, breakFirst=false) {
  const state = this.getJarmState(store)
  const matches = []

  const types = Object.keys({
    ...state.remote,
    ...state.local,
  })
  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const instanceType = types[typeIndex]
    if ('type' in filter && instanceType !== filter.type) {
      continue
    }

    const remoteModel = state.remote[instanceType] || {}
    const localModel = state.local[instanceType] || {}

    const ids = Object.keys({
      ...remoteModel,
      ...localModel,
    })
    for (let idIndex = 0; idIndex < ids.length; idIndex++) {
      const id = ids[idIndex]
      if ('id' in filter && id !== filter.id) {
        continue
      }

      const key = instanceKey(instanceType, id)
      if ('modified' in filter) {
        if (filter.modified) {
          if (id in localModel === false) {
            continue
          }
        }
        else {
          if (id in localModel) {
            continue
          }
        }
      }
      if ('new' in filter) {
        if (filter.new) {
          if (key in state.new === false) {
            continue
          }
        }
        else {
          if (key in state.new) {
            continue
          }
        }
      }
      if ('committed' in filter) {
        if (filter.committed) {
          if (key in state.committed === false) {
            continue
          }
        }
        else {
          if (key in state.committed) {
            continue
          }
        }
      }
      if ('pending' in filter) {
        if (filter.pending) {
          if (key in state.pending === false) {
            continue
          }
        }
        else {
          if (key in state.pending) {
            continue
          }
        }
      }

      let instance = remoteModel[id]
      if (instance) {
        if (id in localModel) {
          instance = mergeInstance(instance, localModel[id])
        }
      }
      else {
        instance = localModel[id]
      }
      if (matchesInstance(instance, filter)) {
        const match = {
          type: instanceType,
          id,
        }
        if (breakFirst) {
          return match
        }
        matches.push(match)
      }
    }
  }
  if (breakFirst) {
    return null
  }
  return matches
}
