// Given a filter, returns all matching instances

export default function(store, filter) {
  const pointers = this.filter(store, filter)
  return this.fill_pointers(store, pointers)
}
