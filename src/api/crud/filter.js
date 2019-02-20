export default function(store, filter) {
  let instances = this.filter_local(store, filter)
  return this.retree_remote(store, instances)
}
