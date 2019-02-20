export default function(store, instanceType, id) {
  const state = this.getJarmState(store)
  if (
    (instanceType in state.local && id in state.local[instanceType])
    || (instanceType in state.remote && id in state.remote[instanceType])
  ) {
    const local = (state.local[instanceType] || {})[id] || {}
    const remote = (state.remote[instanceType] || {})[id] || {}
    return {
      ...remote,
      ...local,
      attributes: {
        ...remote.attributes,
        ...local.attributes,
      },
      relationships: {
        ...remote.relationships,
        ...local.relationships,
      },
    }
  }
  return null
}
