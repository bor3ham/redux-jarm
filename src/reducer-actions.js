const ActionKeys = {
  setRemoteData: 'JARM_SET_REMOTE_DATA',
  setLocalInstance: 'JARM_SET_LOCAL_INSTANCE',
  extendLocalInstance: 'JARM_EXTEND_LOCAL_INSTANCE',
  deleteLocalInstance: 'JARM_DELETE_LOCAL_INSTANCE',
  commitLocalInstance: 'JARM_COMMIT_LOCAL_INSTANCE',
  recordSaving: 'JARM_RECORD_SAVING',
  recordCreationSuccess: 'JARM_RECORD_CREATION_SUCCESS',
  recordCreationError: 'JARM_RECORD_CREATION_ERROR',
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

function recordCreationSuccess(initialId, createdInstance) {
  return {
    type: ActionKeys.recordCreationSuccess,
    initialId,
    createdInstance,
  }
}
function recordCreationError(type, id, error) {
  return {
    type: ActionKeys.recordCreationError,
    instanceType: type,
    id,
    error,
  }
}

export {
  ActionKeys as Keys,
  setRemoteData,
  setLocalInstance,
  extendLocalInstance,
  deleteLocalInstance,
  commitLocalInstance,
  recordSaving,
  recordCreationSuccess,
  recordCreationError,
}
