import uuidv4 from 'uuid/v4'
import * as ReducerActions from './reducer-actions'

function create(newInstance) {
  return (dispatch, getState) => {
    const newId = uuidv4()
    dispatch(ReducerActions.setLocalInstance({
      ...newInstance,
      id: newId,
    }, true))
    return newId
  }
}

function save(type, id, url, createIncludes, updateIncludes, fetchAction) {
  return (dispatch, getState) => {
    const storeState = getState()
    let instanceData = (storeState.local[type] || {})[id]
    // todo: assert instance exists

    dispatch(ReducerActions.recordSaving(type, id))
    return dispatch(fetchAction(url, {method: 'POST',}, instanceData)).then(response => {
      dispatch(ReducerActions.recordCreationSuccess(id, response.data.data))
      return response.data.data
    }).catch((error) => {
      // if conflict - already posted to server
      if (error.status === 409 && error.data.data) {
        dispatch(ReducerActions.setRemoteData([error.data.data]))
        dispatch(ReducerActions.recordCreationSuccess(id, error.data.data))
        return error.data.data
      }
      // otherwise genuine error
      else {
        dispatch(ReducerActions.recordCreationError(type, id, error.data ? error.data : error))
        throw error
      }
    })
  }
}

export {
  create,
  save,
}
