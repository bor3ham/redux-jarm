export default function(instance) {
  if (
    typeof instance === 'object'
    && typeof instance.attributes === 'object'
  ) {
    return !!instance.attributes.deleted_at
  }
  return false
}
