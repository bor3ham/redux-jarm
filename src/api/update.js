import * as ReducerActions from '../reducer-actions.js'

export default function(type, id, changes) {
  return (dispatch, getState) => {
    const storeState = getState()
    const itemKey = `${type}-${id}`
    if (storeState.pending[itemKey]) {
      throw 'Cannot change pending instance'
    }
    return dispatch(ReducerActions.extendLocalInstance(type, id, changes))
  }
}
