export function argsMatch(args1, args2) {
  const combined = {...args1, ...args2}
  for (var key in combined) {
    if (args1[key] !== args2[key]) {
      return false
    }
  }
  return true
}

export function instanceKey(type, id) {
  return `${type}-${id}`
}

export function pointerFromInstance(pointer) {
  const firstHyphen = pointer.indexOf('-')
  return {
    type: pointer.substring(0, firstHyphen),
    id: pointer.substring(firstHyphen + 1),
  }
}

const MERGE_CACHE = {}
MERGE_CACHE.get = function(type, id, local, remote) {
  // cache only one copy of every instance
  const key = instanceKey(type, id)
  const cacheHit = key in this && argsMatch(arguments, this[key].args)
  // if (cacheHit) {
  //   console.warn('merge CACHE HIT')
  // }
  // else {
  //   console.warn('merge CACHE MISS')
  // }
  if (!cacheHit) {
    this[key] = {
      args: arguments,
      result: {
        ...remote || {},
        ...local || {},
        attributes: {
          ...(remote || {}).attributes,
          ...(local || {}).attributes,
        },
        relationships: {
          ...(remote || {}).relationships,
          ...(local || {}).relationships,
        },
      },
    }
  }
  return this[key].result
}.bind(MERGE_CACHE)
export function mergeChanges(type, id, local, remote) {
  return MERGE_CACHE.get(type, id, local, remote)
}
