import { instanceKey } from '../../utils.js'

export default function() {
  return (dispatch, getState) => {
    const state = this.getJarmState(getState())
    const saves = []
    for (var instanceType in state.local) {
      for (var id in state.local[instanceType]) {
        const key = instanceKey(instanceType, id)
        if (state.committed[key] && !state.pending[key]) {
          saves.push(dispatch(this.save(instanceType, id)))
        }
      }
    }
    return Promise.all(saves)
  }
}
