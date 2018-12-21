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
          [action.instance.id]: true,
        }
      }
      return newState
    }
    case Actions.Keys.commitLocalInstance: {
      return {
        ...state,
        committed: {
          ...state.committed,
          [action.instanceType]: {
            ...state.committed[action.instanceType],
            [action.id]: true,
          },
        },
      }
    }
    default:
      return state
  }
}
