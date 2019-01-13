import uuidv4 from 'uuid/v4'
import * as ReducerActions from './reducer-actions'
import { instanceKey } from './utils.js'

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

function save(instanceType, id, url, createIncludes, updateIncludes, fetchAction) {
  return (dispatch, getState) => {
    const storeState = getState()
    if (
      instanceType in storeState.local === false
      || id in storeState.local[instanceType] === false
    ) {
      throw 'Local instance not found'
    }
    const instanceData = storeState.local[instanceType][id]
    const key = instanceKey(instanceType, id)

    if (storeState.pending[key]) {
      throw 'Instance already pending save'
    }
    if (!storeState.committed[key]) {
      dispatch(ReducerActions.commitLocalInstance(instanceType, id))
    }

    dispatch(ReducerActions.recordSaving(instanceType, id))
    if (instanceData === false) {
      // a deletion
    }
    else {
      if (key in storeState.new) {
        // a creation
        return dispatch(fetchAction(url, {method: 'POST',}, instanceData)).then(response => {
          dispatch(ReducerActions.recordUpdateSuccess(id, response.data.data))
          return response.data.data
        }).catch((error) => {
          // if conflict - already posted to server
          if (error.status === 409 && error.data.data) {
            dispatch(ReducerActions.setRemoteData([error.data.data]))
            dispatch(ReducerActions.recordUpdateSuccess(id, error.data.data))
            return error.data.data
          }
          // otherwise genuine error
          else {
            dispatch(ReducerActions.recordUpdateError(instanceType, id, error.data ? error.data : error))
            throw error
          }
        })
      }
      else {
        // a patch
        return dispatch(fetchAction(url, {method: 'PATCH',}, instanceData)).then(response => {
          dispatch(ReducerActions.recordUpdateSuccess(id, response.data.data))
          return response.data.data
        }).catch((error) => {
          dispatch(ReducerActions.recordUpdateError(instanceType, id, error.data ? error.data : error))
          throw error
        })
      }
    }
  }
}

export {
  create,
  save,
}
