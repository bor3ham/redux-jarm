import * as ReducerActions from '../reducer-actions.js'

export default function(type, id, changes) {
  return ReducerActions.extendLocalInstance(type, id, changes)
}
