const ActionKeys = {
  populateData: 'JARM_POPULATE_DATA',
}

function populateData(data) {
  return {
    type: ActionKeys.populateData,
    data: data,
  }
}

export {
  ActionKeys as Keys,
  populateData,
}
