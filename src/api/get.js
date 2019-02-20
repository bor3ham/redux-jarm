export default function(store, instanceType, id) {
  let instance = this.get_local(store, instanceType, id)
  instance = this.retree_remote(store, instance)
  return this.annotate_status(store, instance)
}
