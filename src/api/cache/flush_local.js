import * as ReducerActions from '../../reducer-actions.js'

export default function(type=null) {
  return ReducerActions.flushLocal(type)
}
