import * as ReducerActions from '../../reducer-actions.js'
import { instanceKey } from '../../utils.js'

export default function(type, id, changes) {
  return (dispatch, getState) => {
    const state = this.getJarmState(getState())
    const key = instanceKey(type, id)
    if (state.pending[key]) {
      throw 'Cannot change pending instance'
    }
    return dispatch(ReducerActions.extendLocalInstance(type, id, changes))
  }
}
