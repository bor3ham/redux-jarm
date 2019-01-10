import * as AsyncActions from '../async-actions.js'

export default function(type, id) {
  // todo: make sure local instance exists
  // todo: commit local instance if not committed
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
