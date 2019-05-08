import * as ReducerActions from '../../reducer-actions.js'

export default function(data) {
  let array = data
  if (!Array.isArray(data)) {
    array = [data]
  }
  const additions = []
  const deletions = []
  array.map((item) => {
    if (this.isDeleted(item)) {
      deletions.push(item)
    }
    else {
      additions.push(item)
    }
  })
  return ReducerActions.setRemoteData(additions, deletions)
}
