import { instanceKey, getLocalRelations } from '../../utils.js'

export default function() {
  return (dispatch, getState) => {
    const state = this.getJarmState(getState())
    const saves = []
    for (var instanceType in state.local) {
      for (var id in state.local[instanceType]) {
        const innerState = this.getJarmState(getState())
        const key = instanceKey(instanceType, id)
        // skip anything that itself is not committed
        // or that is already pending
        if (!innerState.committed[key] || innerState.pending[key]) {
          continue
        }
        // skip saving anything with uncommitted local relations
        const instanceData = innerState.local[instanceType][id]
        const localRelations = getLocalRelations(instanceData, innerState)
        let dependsOnUncommitted = false
        for (var relationKey in localRelations) {
          if (!state.committed[relationKey]) {
            dependsOnUncommitted = true
          }
        }
        if (dependsOnUncommitted) {
          continue
        }
        saves.push(dispatch(this.save(instanceType, id)))
      }
    }
    return Promise.all(saves)
  }
}
