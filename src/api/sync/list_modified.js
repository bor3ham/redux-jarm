import { instanceKey } from '../../utils.js'

export default function(store) {
  const state = this.getJarmState(store)
  const modified = []
  for (var instanceType in state.local) {
    for (var id in state.local[instanceType]) {
      const key = instanceKey(instanceType, id)
      if (key in state.committed === false) {
        continue
      }
      modified.push({
        type: instanceType,
        id,
      })
    }
  }
  return modified
}
