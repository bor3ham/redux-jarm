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

export {
  create,
}
