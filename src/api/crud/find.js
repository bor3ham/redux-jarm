export default function(store, filter) {
  let instance = this.find_local(store, filter)
  instance = this.retree_remote(store, instance)
  return this.annotate_status(store, instance)
}
