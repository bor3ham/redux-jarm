import * as AsyncActions from '../../async-actions.js'

export default function(instanceType, id) {
  return (dispatch, getState) => {
    const model = this.schema[instanceType]
    if (!model) {
      throw('Cannot save: no model definition in jarm schema')
    }
    if (!model.url) {
      throw('Cannot save: no url in jarm model schema')
    }
    const url = `${this.baseUrl}${model.url}`
    return dispatch(AsyncActions.save.bind(this)(
      instanceType,
      id,
      url,
      model.createIncludes,
      model.updateIncludes,
      this.fetch,
    ))
  }
}
