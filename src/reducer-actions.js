const ActionKeys = {
  setRemoteData: 'JARM_SET_REMOTE_DATA',
  setLocalInstance: 'JARM_SET_LOCAL_INSTANCE',
  extendLocalInstance: 'JARM_EXTEND_LOCAL_INSTANCE',
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

function extendLocalInstance(type, id, changes) {
  return {
    type: ActionKeys.extendLocalInstance,
    instanceType: type,
    id,
    changes,
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
  extendLocalInstance,
  commitLocalInstance,
}
