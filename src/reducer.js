import * as Actions from './reducer-actions.js'

export default function reducer(state={
  remote: {},
  local: {},
  new: {},
  committed: {},
  pending: {},
  errors: {},
}, action) {
  switch(action.type) {
    case Actions.Keys.setRemoteData: {
      let newState = {
        ...state,
        remote: {
          ...state.remote,
        },
      }
      action.data.map((item) => {
        newState.remote[item.type] = {
          ...newState.remote[item.type],
          [item.id]: item,
        }
      })
      return newState
    }
    case Actions.Keys.setLocalInstance: {
      let newState = {
        ...state,
        local: {
          ...state.local,
          [action.instance.type]: {
            ...state.local[action.instance.type],
            [action.instance.id]: action.instance,
          },
        },
      }
      if (action.isNew) {
        newState.new = {
          ...newState.new,
          [`${action.instance.type}-${action.instance.id}`]: true,
        }
      }
      let instanceKey = `${action.instance.type}-${action.instance.id}`
      if (instanceKey in newState.committed) {
        newState.commited = {
          ...newState.committed
        }
        delete newState.committed[instanceKey]
      }
      return newState
    }
    case Actions.Keys.extendLocalInstance: {
      let existingInstance = (state.local[action.instanceType] || {})[action.id] || {}
      let newState = {
        ...state,
        local: {
          ...state.local,
          [action.instanceType]: {
            ...state.local[action.instanceType],
            [action.id]: {
              ...existingInstance,
              ...action.changes,
              attributes: {
                ...existingInstance.attributes,
                ...action.changes.attributes,
              },
              relationships: {
                ...existingInstance.relationships,
                ...action.changes.relationships,
              },
            },
          },
        },
      }
      let instanceKey = `${action.instanceType}-${action.id}`
      if (instanceKey in newState.committed) {
        newState.commited = {
          ...newState.committed
        }
        delete newState.committed[instanceKey]
      }
      return newState
    }
    case Actions.Keys.commitLocalInstance: {
      const key = `${action.instanceType}-${action.id}`
      return {
        ...state,
        committed: {
          ...state.committed,
          [key]: true,
        },
      }
    }
    case Actions.Keys.recordSaving: {
      const key = `${action.instanceType}-${action.id}`
      return {
        ...state,
        pending: {
          ...state.pending,
          [key]: true,
        },
      }
    }
    case Actions.Keys.recordCreationSuccess: {
      const newState = {
        ...state,
      }
      const key = `${action.createdInstance.type}-${action.initialId}`
      if (key in newState.pending) {
        newState.pending = {
          ...newState.pending,
        }
        delete newState.pending[key]
      }
      if (key in newState.new) {
        newState.new = {
          ...newState.new,
        }
        delete newState.new[key]
      }
      if (action.createdInstance.type in newState.local) {
        if (action.initialId in newState.local[action.createdInstance.type]) {
          newState.local = {
            ...newState.local,
            [action.createdInstance.type]: {
              ...newState.local[action.createdInstance.type],
            },
          }
          delete newState.local[action.createdInstance.type][action.initialId]
        }
      }
      if (action.createdInstance.id != action.intialId) {
        // todo: update all ids if it has changed
      }
      return newState
    }
    default:
      return state
  }
}
