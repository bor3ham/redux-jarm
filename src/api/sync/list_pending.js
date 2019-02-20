import { pointerFromInstance } from '../../utils.js'

export default function(store) {
  const state = this.getJarmState(store)
  const pending = []
  for (var key in state.pending) {
    pending.push(pointerFromInstance(key))
  }
  return pending
}
