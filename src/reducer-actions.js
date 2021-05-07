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
  recordDeleteSuccess: 'JARM_RECORD_DELETE_SUCCESS',
  recordDeleteError: 'JARM_RECORD_DELETE_ERROR',
  flushLocal: 'JARM_FLUSH_LOCAL',
  flushRemote: 'JARM_FLUSH_REMOTE',
}
export {
  ActionKeys as Keys,
}

export function setRemoteData(additions=[], removals=[]) {
  return {
    type: ActionKeys.setRemoteData,
    additions,
    removals,
  }
}

export function setLocalInstance(instance, isNew) {
  return {
    type: ActionKeys.setLocalInstance,
    instance,
    isNew,
  }
}

export function extendLocalInstance(type, id, changes) {
  return {
    type: ActionKeys.extendLocalInstance,
    instanceType: type,
    id,
    changes,
  }
}
export function deleteLocalInstance(type, id) {
  return {
    type: ActionKeys.deleteLocalInstance,
    instanceType: type,
    id,
  }
}
export function discardLocalInstance(type, id) {
  return {
    type: ActionKeys.discardLocalInstance,
    instanceType: type,
    id,
  }
}

export function commitLocalInstance(type, id) {
  return {
    type: ActionKeys.commitLocalInstance,
    instanceType: type,
    id,
  }
}

export function recordSaving(type, id) {
  return {
    type: ActionKeys.recordSaving,
    instanceType: type,
    id,
  }
}

export function recordUpdateSuccess(initialId, createdInstance) {
  return {
    type: ActionKeys.recordUpdateSuccess,
    initialId,
    createdInstance,
  }
}
export function recordUpdateError(type, id, error) {
  return {
    type: ActionKeys.recordUpdateError,
    instanceType: type,
    id,
    error,
  }
}

export function recordDeleteSuccess(type, id) {
  return {
    type: ActionKeys.recordDeleteSuccess,
    instanceType: type,
    id,
  }
}
export function recordDeleteError(type, id, error) {
  return {
    type: ActionKeys.recordDeleteError,
    instanceType: type,
    id,
    error,
  }
}

export function flushLocal(type) {
  return {
    type: ActionKeys.flushLocal,
    instanceType: type,
  }
}
export function flushRemote(type) {
  return {
    type: ActionKeys.flushRemote,
    instanceType: type,
  }
}
