function instanceKey(type, id) {
  return `${type}-${id}`
}

function pointerFromInstance(pointer) {
  const firstHyphen = pointer.indexOf('-')
  return {
    type: pointer.substring(0, firstHyphen),
    id: pointer.substring(firstHyphen + 1),
  }
}

export { instanceKey, pointerFromInstance }
