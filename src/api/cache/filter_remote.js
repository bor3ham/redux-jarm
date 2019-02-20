import { filterAll } from '../utils.js'

export default function(store, filter) {
  const pointers = filterAll(store, filter)
  const instances = pointers.map((pointer) => {
    return this.get_remote(store, pointer.type, pointer.id)
  })
  return instances
}
