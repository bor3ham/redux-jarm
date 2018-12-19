import * as Actions from './actions.js'

export default function reducer(state={
  remote: {},
  local: {},
}, action) {
  switch(action.type) {
    case Actions.Keys.populateData: {
      let newState = {
        ...state,
        remote: {
          ...state.remote,
        },
      }
      action.data.map((item) => {
        newState.remote[item.type] = {
          ...newState.remote[item.type],
        }
        newState.remote[item.type][item.id] = item
      })
      return newState
    }
    default:
      return state
  }
}
