import * as AsyncActions from '../async-actions.js'
import { instanceKey } from '../utils.js'

export default function(instanceType, id) {
  return (dispatch, getState) => {
    const key = instanceKey(instanceType, id)
    const state = getState()

    if (instanceType in state.local === false || id in state.local[instanceType] === false) {
      throw 'Local instance not found'
    }
    if (state.pending[key]) {
      throw 'Instance already pending save'
    }
    if (!state.committed[key]) {
      dispatch(ReducerActions.commitLocalInstance(instanceType, id))
    }

    const model = this.schema[instanceType]
    const url = `${this.baseUrl}${model.url}`
    return dispatch(AsyncActions.save(
      instanceType,
      id,
      url,
      model.createIncludes,
      model.updateIncludes,
      this.fetch,
    ))
  }
}
