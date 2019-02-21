// Given a filter, returns the first matching pointer

export default function(store, filter) {
  return this.filter(store, filter, true)
}
