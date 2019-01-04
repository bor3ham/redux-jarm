export default function(store, type, id) {
  let instance = this.get_local(store, type, id)
  instance = this.retree_remote(store, instance)
  return this.annotate_status(store, instance)
}
