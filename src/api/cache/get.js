// Given a filter, returns the first matching instance

export default function(store, filter) {
  const pointer = this.find(store, filter)
  return this.fill_pointers(store, pointer)
}
