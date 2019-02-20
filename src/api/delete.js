import * as ReducerActions from '../reducer-actions.js'
import { instanceKey } from '../utils.js'

export default function(type, id) {
  return (dispatch, getState) => {
    const state = this.getJarmState(getState())
    const key = instanceKey(type, id)
    if (state.pending[key]) {
      throw 'Cannot delete pending instance'
    }
    return dispatch(ReducerActions.deleteLocalInstance(type, id))
  }
}
