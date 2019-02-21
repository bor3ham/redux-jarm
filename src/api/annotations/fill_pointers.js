export default function(store, pointer) {
  if (Array.isArray(pointer)) {
    return pointer.map((item) => {
      return this.fill_pointers(store, item)
    })
  }
  const state = this.getJarmState(store)
  if (
    pointer !== null
    && typeof pointer === 'object'
    && (
      (pointer.type in state.local && pointer.id in state.local[pointer.type])
      || (pointer.type in state.remote && pointer.id in state.remote[pointer.type])
    )
  ) {
    const local = (state.local[pointer.type] || {})[pointer.id] || {}
    const remote = (state.remote[pointer.type] || {})[pointer.id] || {}
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
  return pointer
}
