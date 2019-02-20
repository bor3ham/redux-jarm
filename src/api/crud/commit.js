import * as ReducerActions from '../../reducer-actions.js'

export default function(type, id) {
  return ReducerActions.commitLocalInstance(type, id)
}
