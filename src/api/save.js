import * as AsyncActions from '../async-actions.js'

export default function(type, id) {
  const model = this.schema[type]
  const url = `${this.baseUrl}${model.url}`
  return AsyncActions.save(
    type,
    id,
    url,
    model.createIncludes,
    model.updateIncludes,
    this.fetch,
  )
}
