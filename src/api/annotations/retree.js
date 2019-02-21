export default function(store, instance, alreadyHit={}) {
  // recurse loop arrays
  if (Array.isArray(instance)) {
    return instance.map((item) => {
      return this.retree(store, item, alreadyHit)
    })
  }
  // null and non-objects
  if (!instance || typeof instance !== 'object') {
    return instance
  }

  // abort recursion on repeat types
  if (instance.type in alreadyHit) {
    return instance
  }

  const state = this.getJarmState(store)

  const newAlreadyHit = {
    ...alreadyHit,
  }
  newAlreadyHit[instance.type] = true

  let newInstance = {
    ...instance,
  }
  // fill self if only pointer
  if ('attributes' in newInstance === false && 'relationships' in newInstance === false) {
    newInstance = this.fill_pointers(store, newInstance)
  }
  if (newInstance !== null) {
    // go through relations
    if ('relationships' in newInstance) {
      for (var relationKey in newInstance.relationships) {
        if (
          typeof newInstance.relationships[relationKey] === 'object'
          && 'data' in newInstance.relationships[relationKey]
        ) {
          newInstance.relationships[relationKey] = {
            ...newInstance.relationships[relationKey],
            data: this.retree(store, newInstance.relationships[relationKey].data, newAlreadyHit),
          }
        }
      }
    }
  }
  return newInstance
}
