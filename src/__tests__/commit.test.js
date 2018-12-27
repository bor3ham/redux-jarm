import getStore from './store.js'
import jarm from './jarm.js'

test('commit a created instance', () => {
  const store = getStore()
  const createData = {
    type: 'Task',
    attributes: {
      name: 'Mow the lawn',
    },
  }
  const newId = store.dispatch(jarm.create(createData))
  const oldState = store.getState()
  store.dispatch(jarm.commit(createData.type, newId))
  const newState = store.getState()
  // make sure no object mutation has happened
  expect(oldState.committed).not.toBe(newState.committed)
  const key = `${createData.type}-${newId}`
  expect(newState.committed[key]).toBeTruthy()
})

// todo: commit changes to existing instance
// todo: commit changes to instance that does not exist
