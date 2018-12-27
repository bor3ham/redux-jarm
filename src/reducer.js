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
    default:
      return state
  }
}
