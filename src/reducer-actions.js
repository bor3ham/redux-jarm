const ActionKeys = {
  setRemoteData: 'JARM_SET_REMOTE_DATA',
  setLocalInstance: 'JARM_SET_LOCAL_INSTANCE',
  commitLocalInstance: 'JARM_COMMIT_LOCAL_INSTANCE',
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

function commitLocalInstance(type, id) {
  return {
    type: ActionKeys.commitLocalInstance,
    instanceType: type,
    id,
  }
}

export {
  ActionKeys as Keys,
  setRemoteData,
  setLocalInstance,
  commitLocalInstance,
}
