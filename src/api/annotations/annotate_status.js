export default function(store, instance) {
  if (instance === null) {
    return instance
  }
  if (!instance.type) {
    throw('No type in instance')
  }
  if (!instance.id) {
    throw('No id in instance')
  }
  const state = this.getJarmState(store)
  const instanceKey = `${instance.type}-${instance.id}`
  const local = state.local[instance.type] || {}
  const remote = state.remote[instance.type] || {}
  const isCommitted = !!state.committed[instanceKey]
  const isPending = !!state.pending[instanceKey]
  const isNew = !!state.new[instanceKey]
  let status = 'unchanged'
  if (local[instance.id] === false) {
    if (isPending) {
      status = 'deleted-pending'
    }
    else if (isCommitted) {
      status = 'deleted-committed'
    }
    else {
      status = 'deleted'
    }
  }
  else if (local[instance.id]) {
    if (isNew) {
      if (isPending) {
        status = 'draft-pending'
      }
      else if (isCommitted) {
        status = 'draft-committed'
      }
      else {
        status = 'draft'
      }
    }
    else {
      if (isPending) {
        status = 'modified-pending'
      }
      else if (isCommitted) {
        status = 'modified-committed'
      }
      else {
        status = 'modified'
      }
    }
  }
  return {
    ...instance,
    [this.statusKey]: status,
  }
}
