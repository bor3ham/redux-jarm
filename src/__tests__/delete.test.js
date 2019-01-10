import getStore from './store.js'
import jarm from './jarm.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}

test('delete unchanged instance', () => {
  const store = getStore()
  // create the initial data
  store.dispatch(jarm.populate(testTask1))

  // delete it
  const initialState = store.getState()
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  const endState = store.getState()

  const itemKey = `${testTask1.type}-${testTask1.id}`
  expect(endState.local[testTask1.type][testTask1.id]).toBe(false)
  expect(endState.committed[itemKey]).toBeFalsy()
  // make sure no object mutation has happened
  expect(initialState.local).not.toBe(endState.local)
  expect(initialState.local[testTask1.type]).not.toBe(endState.local[testTask1.type])
})

// todo: delete uncommitted changed instance
// todo: delete committed changed instance (not pending)
// todo: delete committed changed instance (pending)
// todo: delete instance that does not exist
