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
      // todo: check if created or no content
      dispatch(ReducerActions.recordCreationSuccess(id, response.data.data))
      return response.data
    }).catch((error) => {
      let errorData = error
      if (errorData && 'data' in errorData) {
        errorData = errorData.data
      }
      dispatch(ReducerActions.recordCreationError(type, id, errorData))
      throw error
    })
  }
}

export {
  create,
  save,
}
