export default function(store) {
  const state = this.getJarmState(store)
  const local = []
  for (var instanceType in state.local) {
    for (var id in state.local[instanceType]) {
      local.push({
        type: instanceType,
        id,
      })
    }
  }
  return local
}
