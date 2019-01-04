import * as ReducerActions from '../reducer-actions.js'

export default function(data) {
  if (!Array.isArray(data)) {
    return ReducerActions.setRemoteData([data])
  }
  else {
    return ReducerActions.setRemoteData(data)
  }
}
