const ActionKeys = {
  setRemoteData: 'JARM_SET_REMOTE_DATA',
  setLocalInstance: 'JARM_SET_LOCAL_INSTANCE',
  extendLocalInstance: 'JARM_EXTEND_LOCAL_INSTANCE',
  deleteLocalInstance: 'JARM_DELETE_LOCAL_INSTANCE',
  discardLocalInstance: 'JARM_DISCARD_LOCAL_INSTANCE',
  commitLocalInstance: 'JARM_COMMIT_LOCAL_INSTANCE',
  recordSaving: 'JARM_RECORD_SAVING',
  recordUpdateSuccess: 'JARM_RECORD_UPDATE_SUCCESS',
  recordUpdateError: 'JARM_RECORD_UPDATE_ERROR',
  flushLocal: 'JARM_FLUSH_LOCAL',
  flushRemote: 'JARM_FLUSH_REMOTE',
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
function deleteLocalInstance(type, id) {
  return {
    type: ActionKeys.deleteLocalInstance,
    instanceType: type,
    id,
  }
}
function discardLocalInstance(type, id) {
  return {
    type: ActionKeys.discardLocalInstance,
    instanceType: type,
    id,
  }
}

function commitLocalInstance(type, id) {
  return {
    type: ActionKeys.commitLocalInstance,
    instanceType: type,
    id,
  }
}

function recordSaving(type, id) {
  return {
    type: ActionKeys.recordSaving,
    instanceType: type,
    id,
  }
}

function recordUpdateSuccess(initialId, createdInstance) {
  return {
    type: ActionKeys.recordUpdateSuccess,
    initialId,
    createdInstance,
  }
}
function recordUpdateError(type, id, error) {
  return {
    type: ActionKeys.recordUpdateError,
    instanceType: type,
    id,
    error,
  }
}

function flushLocal() {
  return {
    type: ActionKeys.flushLocal,
  }
}
function flushRemote() {
  return {
    type: ActionKeys.flushRemote,
  }
}

export {
  ActionKeys as Keys,
  setRemoteData,
  setLocalInstance,
  extendLocalInstance,
  deleteLocalInstance,
  discardLocalInstance,
  commitLocalInstance,
  recordSaving,
  recordUpdateSuccess,
  recordUpdateError,
  flushLocal,
  flushRemote,
}
