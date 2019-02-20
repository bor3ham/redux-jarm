export default function(store, instanceType, id) {
  const state = this.getJarmState(store)
  if (instanceType in state.remote) {
    if (id in state.remote[instanceType]) {
      return state.remote[instanceType][id]
    }
  }
  return null
}
