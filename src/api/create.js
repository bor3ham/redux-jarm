import * as AsyncActions from '../async-actions.js'

export default function(newFields) {
  if ('type' in newFields === false) {
    throw('No type in instance')
  }
  const template = (this.schema[newFields.type] || {}).newTemplate || {}
  const newInstance = {
    ...template,
    ...newFields,
    attributes: {
      ...template.attributes,
      ...newFields.attributes,
    },
    relationships: {
      ...template.relationships,
      ...newFields.relationships,
    },
  }
  return AsyncActions.create(newInstance)
}
