import { mergeChanges } from '../../utils.js'

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
    let local = null
    let remote = null
    if (pointer.type in state.local && pointer.id in state.local[pointer.type]) {
      local = state.local[pointer.type][pointer.id]
    }
    if (pointer.type in state.remote && pointer.id in state.remote[pointer.type]) {
      remote = state.remote[pointer.type][pointer.id]
    }
    return mergeChanges(pointer.type, pointer.id, local, remote)
  }
  return pointer
}
