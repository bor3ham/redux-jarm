import { v4 as uuidv4 } from 'uuid'
import * as ReducerActions from './reducer-actions'
import { instanceKey, pointerFromInstance, getLocalRelations } from './utils.js'

export const ALREADY_PENDING_ERROR = 'Instance already pending save'
export const LOCAL_INSTANCE_NOT_FOUND_ERROR = 'Local instance not found'
export const UNCOMMITTED_DEPENDENCY_ERROR = 'Instance depends on uncommitted local instance'

export function create(newInstance) {
  return (dispatch, getState) => {
    const newId = uuidv4()
    dispatch(ReducerActions.setLocalInstance({
      ...newInstance,
      id: newId,
    }, true))
    return newId
  }
}

export function save(
  instanceType,
  id,
  url,
  createIncludes,
  updateIncludes,
  fetchAction,
  newIdAction,
) {
  return (dispatch, getState) => {
    const state = this.getJarmState(getState())
    if (
      instanceType in state.local === false
      || id in state.local[instanceType] === false
    ) {
      throw LOCAL_INSTANCE_NOT_FOUND_ERROR
    }
    const instanceData = state.local[instanceType][id]
    const key = instanceKey(instanceType, id)

    if (state.pending[key]) {
      throw ALREADY_PENDING_ERROR
    }
    if (!state.committed[key]) {
      dispatch(ReducerActions.commitLocalInstance(instanceType, id))
    }

    dispatch(ReducerActions.recordSaving(instanceType, id))

    const performSave = () => {
      if (instanceData === false) {
        // a deletion
        return dispatch(fetchAction(url, {method: 'DELETE',}, {})).then(response => {
          dispatch(ReducerActions.recordDeleteSuccess(instanceType, id))
        }).catch((error) => {
          dispatch(ReducerActions.recordDeleteError(
            instanceType, id, error.data ? error.data : error
          ))
          throw error
        })
      }
      else {
        if (key in state.new) {
          // a creation
          let postUrl = url
          if (createIncludes) {
            postUrl = `${postUrl}?include=${createIncludes}`
          }
          return dispatch(fetchAction(postUrl, {method: 'POST',}, {
            data: instanceData,
          })).then(response => {
            dispatch(ReducerActions.recordUpdateSuccess(id, response.data.data))
            if (response.data.data.id != id) {
              dispatch(newIdAction(id, response.data.data.id))
            }
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
              dispatch(ReducerActions.recordUpdateError(
                instanceType, id, error.data ? error.data : error
              ))
              throw error
            }
          })
        }
        else {
          // a patch
          let patchUrl = `${url}${id}/`
          if (updateIncludes) {
            patchUrl = `${patchUrl}?include=${updateIncludes}`
          }
          return dispatch(fetchAction(patchUrl, {method: 'PATCH',}, {
            data: {
              type: instanceType,
              id,
              ...instanceData,
            },
          })).then(response => {
            dispatch(ReducerActions.recordUpdateSuccess(id, response.data.data))
            return response.data.data
          }).catch((error) => {
            dispatch(ReducerActions.recordUpdateError(
              instanceType, id, error.data ? error.data : error
            ))
            throw error
          })
        }
      }
    }

    // get all relationship values that are local instances
    const localRelations = getLocalRelations(instanceData, state)
    // if there are any local instances
    if (Object.keys(localRelations).length > 0) {
      // throw an exception if any are uncommitted
      for (var relationKey in localRelations) {
        if (!state.committed[relationKey]) {
          dispatch(ReducerActions.recordUpdateError(
            instanceType, id, 'Instance depends on uncommitted local instance'
          ))
          throw UNCOMMITTED_DEPENDENCY_ERROR
        }
      }
      // save any relations before saving this instance itself
      const relationWaits = []
      for (let relationKey in localRelations) {
        const ptr = pointerFromInstance(relationKey)
        relationWaits.push(new Promise((resolve, reject) => {
          dispatch(this.save(ptr.type, ptr.id)).then(resolve)
        }).catch(error => {
          // if the relation is already pending a save, poll until it's complete
          if (error === ALREADY_PENDING_ERROR) {
            return new Promise((resolve, reject) => {
              let check = () => {
                const checkState = this.getJarmState(getState())
                if (checkState.pending[relationKey]) {
                  setTimeout(check, 500)
                }
                else {
                  resolve()
                }
              }
              setTimeout(check, 500)
            })
          }
          throw error
        }))
      }
      return Promise.all(relationWaits).then(() => {
        return performSave()
      }).catch((error) => {
        dispatch(ReducerActions.recordUpdateError(
          instanceType, id, error.data ? error.data : error
        ))
        throw error
      })
    }

    return performSave()
  }
}
