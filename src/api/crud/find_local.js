import { filterFirst } from '../utils.js'

// Finds instance by given [filter]
// Searches across type, attributes, and relationships of local instances
// Returns first matching local instance or null

export default function(store, filter) {
  const pointer = filterFirst.bind(this)(store, filter)
  if (pointer) {
    return this.get_local(store, pointer.type, pointer.id)
  }
  return null
}
