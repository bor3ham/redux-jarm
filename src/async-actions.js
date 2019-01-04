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
      console.log('recording success:', Object.keys(response))
      console.log('status:', response.status)
      dispatch(ReducerActions.recordCreationSuccess(id, response.data))
      return response.data
    })
    // .catch((error) => {
    //   console.log('recording failure')

    // })
  }
}

export {
  create,
  save,
}
