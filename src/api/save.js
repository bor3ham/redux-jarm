import * as AsyncActions from '../async-actions.js'

export default function(instanceType, id) {
  return (dispatch, getState) => {
    const model = this.schema[instanceType]
    const url = `${this.baseUrl}${model.url}`
    return dispatch(AsyncActions.save(
      instanceType,
      id,
      url,
      model.createIncludes,
      model.updateIncludes,
      this.fetch,
    ))
  }
}
