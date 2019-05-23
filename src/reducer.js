import * as Actions from './reducer-actions.js'
import { instanceKey } from './utils.js'

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
      action.additions.map((item) => {
        newState.remote[item.type] = {
          ...newState.remote[item.type],
          [item.id]: item,
        }
      })
      action.removals.map((item) => {
        newState.remote[item.type] = {
          ...newState.remote[item.type],
        }
        if (item.id in newState.remote[item.type]) {
          delete newState.remote[item.type][item.id]
        }
      })
      const purgeNew = (item) => {
        const key = instanceKey(item.type, item.id)
        if (key in newState.new) {
          newState.new = {
            ...newState.new,
          }
          delete newState.new[key]
          if (newState.local[item.type]) {
            if (item.id in newState.local[item.type]) {
              newState.local[item.type] = {
                ...newState.local[item.type],
              }
              delete newState.local[item.type][item.id]
            }
          }
          if (key in newState.committed) {
            newState.committed = {
              ...newState.committed,
            }
            delete newState.committed[key]
          }
        }
      }
      action.additions.map(purgeNew)
      action.removals.map(purgeNew)
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
      const key = instanceKey(action.instance.type, action.instance.id)
      if (key in newState.committed) {
        newState.committed = {
          ...newState.committed
        }
        delete newState.committed[key]
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
      const key = instanceKey(action.instanceType, action.id)
      if (key in newState.committed) {
        newState.committed = {
          ...newState.committed,
        }
        delete newState.committed[key]
      }
      return newState
    }
    case Actions.Keys.deleteLocalInstance: {
      let newState = {
        ...state,
        local: {
          ...state.local,
          [action.instanceType]: {
            ...state.local[action.instanceType],
            [action.id]: false,
          },
        },
      }
      const key = instanceKey(action.instanceType, action.id)
      if (key in newState.committed) {
        newState.committed = {
          ...newState.committed,
        }
        delete newState.committed[key]
      }
      return newState
    }
    case Actions.Keys.discardLocalInstance: {
      let newState = {
        ...state,
        local: {
          ...state.local,
          [action.instanceType]: {
            ...state.local[action.instanceType],
          },
        },
      }
      if (action.id in newState.local[action.instanceType]) {
        delete newState.local[action.instanceType][action.id]
      }
      const key = instanceKey(action.instanceType, action.id)
      if (key in newState.committed) {
        newState.committed = {
          ...newState.committed,
        }
        delete newState.committed[key]
      }
      return newState
    }
    case Actions.Keys.commitLocalInstance: {
      const key = instanceKey(action.instanceType, action.id)
      return {
        ...state,
        committed: {
          ...state.committed,
          [key]: true,
        },
      }
    }
    case Actions.Keys.recordSaving: {
      const key = instanceKey(action.instanceType, action.id)
      return {
        ...state,
        pending: {
          ...state.pending,
          [key]: true,
        },
      }
    }
    case Actions.Keys.recordUpdateSuccess: {
      const newState = {
        ...state,
      }
      const key = instanceKey(action.createdInstance.type, action.initialId)
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
      if (key in newState.errors) {
        newState.errors = {
          ...newState.errors,
        }
        delete newState.errors[key]
      }
      // if the item was assigned a new ID on creation,
      // go through the entire cache and update local references to new ID
      if (action.createdInstance.id != action.intialId) {
        newState.local = {
          ...newState.local,
        }
        for (let instanceType in newState.local) {
          newState.local[instanceType] = {
            ...newState.local[instanceType],
          }
          for (let instanceId in newState.local[instanceType]) {
            let instance = newState.local[instanceType][instanceId]
            let needsUpdating = false
            let updatedInstance = {
              ...instance,
              relationships: {
                ...instance.relationships,
              },
            }
            for (var relationKey in instance.relationships) {
              const relation = instance.relationships[relationKey].data
              if (Array.isArray(relation)) {
                updatedInstance.relationships[relationKey].data = relation.map((item) => {
                  if (item.id === action.intialId) {
                    needsUpdating = true
                    return {
                      ...item,
                      id: action.createdInstance.id,
                    }
                  }
                  else {
                    return item
                  }
                })
              }
              else {
                if (relation.id === action.initialId) {
                  needsUpdating = true
                  updatedInstance.relationships[relationKey].data = {
                    ...relation,
                    id: action.createdInstance.id,
                  }
                }
              }
            }
            if (needsUpdating) {
              newState.local[instanceType][instanceId] = updatedInstance
            }
          }
        }
      }
      return newState
    }
    case Actions.Keys.recordUpdateError: {
      const newState = {
        ...state,
      }
      const key = instanceKey(action.instanceType, action.id)
      if (key in newState.pending) {
        newState.pending = {
          ...newState.pending,
        }
        delete newState.pending[key]
      }
      newState.errors = {
        ...newState.errors,
        [key]: action.error,
      }
      return newState
    }
    case Actions.Keys.flushLocal: {
      return {
        ...state,
        local: {},
        new: {},
        pending: {},
        committed: {},
        errors: {},
      }
    }
    case Actions.Keys.flushRemote: {
      return {
        ...state,
        remote: {},
      }
    }
    default:
      return state
  }
}
