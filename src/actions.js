import uuidv4 from 'uuid/v4'

const ActionKeys = {
  setRemoteData: 'JARM_SET_REMOTE_DATA',
  setLocalInstance: 'JARM_SET_LOCAL_INSTANCE',
}

function setRemoteData(data) {
  return {
    type: ActionKeys.setRemoteData,
    data,
  }
}

function setLocalInstance(instance, isNew) {
  return {
    type: ActionKeys.setLocalInstance,
    instance,
    isNew,
  }
}

function create(newInstance) {
  return (dispatch, getState) => {
    const newId = uuidv4()
    dispatch(setLocalInstance({
      ...newInstance,
      id: newId,
    }, true))
    return newId
  }
}

export {
  ActionKeys as Keys,
  setRemoteData,
  create,
}
