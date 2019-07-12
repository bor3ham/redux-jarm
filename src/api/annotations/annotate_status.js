import { instanceKey, argsMatch } from '../../utils.js'

function getInstanceStatus(localInstance, isNew, isCommitted, isPending) {
  // console.log('getting instance status', localInstance, isNew, isCommitted, isPending)
  if (localInstance === false) {
    if (isPending) {
      return 'deleted-pending'
    }
    else if (isCommitted) {
      return 'deleted-committed'
    }
    else {
      return 'deleted'
    }
  }
  else if (localInstance) {
    if (isNew) {
      if (isPending) {
        return 'draft-pending'
      }
      else if (isCommitted) {
        return 'draft-committed'
      }
      else {
        return 'draft'
      }
    }
    else {
      if (isPending) {
        return 'modified-pending'
      }
      else if (isCommitted) {
        return 'modified-committed'
      }
      else {
        return 'modified'
      }
    }
  }
  return 'unchanged'
}

const ANNOTATED_STATUS_CACHE = {}
ANNOTATED_STATUS_CACHE.get = function(
  queryInstance,
  statusKey,
  localInstance,
  isNew,
  isCommitted,
  isPending,
) {
  // cache only one copy of every instance
  const key = instanceKey(queryInstance.type, queryInstance.id)
  const cacheHit = key in this && argsMatch(arguments, this[key].args)
  // if (cacheHit) {
  //   console.warn('annotate CACHE HIT')
  // }
  // else {
  //   console.warn('annotate CACHE MISS')
  // }
  if (!cacheHit) {
    this[key] = {
      args: arguments,
      result: {
        ...queryInstance,
        [statusKey]: getInstanceStatus(localInstance, isNew, isCommitted, isPending),
      },
    }
  }
  return this[key].result
}.bind(ANNOTATED_STATUS_CACHE)

export default function(store, instance) {
  if (Array.isArray(instance)) {
    return instance.map((item) => {
      return this.annotate_status(store, item)
    })
  }
  if (instance === null) {
    return instance
  }
  if (!instance.type) {
    throw('No type in instance')
  }
  if (!instance.id) {
    throw('No id in instance')
  }
  const state = this.getJarmState(store)
  const instanceKey = `${instance.type}-${instance.id}`
  const local = state.local[instance.type] || {}
  const isNew = !!state.new[instanceKey]
  const isCommitted = !!state.committed[instanceKey]
  const isPending = !!state.pending[instanceKey]
  return ANNOTATED_STATUS_CACHE.get(
    instance,
    this.statusKey,
    local[instance.id],
    isNew,
    isCommitted,
    isPending,
  )
}
