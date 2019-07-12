import getStore from '../store.js'
import jarm from '../jarm.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}
const testTask2 = {
  type: 'Task',
  id: 'aaa-002',
  attributes: {
    name: 'Trim the hedges',
  },
}

test('populate from individual', () => {
  const store = getStore()
  const oldState = store.getState()
  store.dispatch(jarm.populate(testTask1))
  const newState = store.getState()

  expect(newState).toMatchObject({
    'remote': {
      [testTask1.type]: {
        [testTask1.id]: testTask1,
      },
    },
  })
  // assert no state mutation
  expect(oldState.remote).not.toBe(newState.remote)
})

test('populate twice from individuals', () => {
  const store = getStore()
  const oldState = store.getState()
  store.dispatch(jarm.populate(testTask1))
  const middleState = store.getState()
  store.dispatch(jarm.populate(testTask2))
  const newState = store.getState()

  expect(newState).toMatchObject({
    'remote': {
      [testTask1.type]: {
        [testTask1.id]: testTask1,
        [testTask2.id]: testTask2,
      },
    },
  })
  // assert no state mutation
  expect(oldState.remote).not.toBe(middleState.remote)
  expect(middleState.remote).not.toBe(newState.remote)
  expect(middleState.remote[testTask1.type]).not.toBe(newState.remote[testTask1.type])
})

test('populate twice from duplicate individual', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.populate(testTask1))
  const newState = store.getState()

  expect(newState).toMatchObject({
    'remote': {
      [testTask1.type]: {
        [testTask1.id]: testTask1,
      },
    },
  })
})

test('populate from set', () => {
  const store = getStore()
  const oldState = store.getState()
  store.dispatch(jarm.populate([
    testTask1,
    testTask2,
  ]))
  const newState = store.getState()

  expect(newState).toMatchObject({
    'remote': {
      [testTask1.type]: {
        [testTask1.id]: testTask1,
        [testTask2.id]: testTask2,
      },
    },
  })
  // assert no state mutation
  expect(oldState.remote).not.toBe(newState.remote)
})

// todo: populate item that collides with existing new id
// todo: populate item that has local changes

// todo: populate learn of deleted item with no changes
// todo: populate learn of deleted item with local changes
// todo: populate learn of deleted item with pending changes
// todo: populate learn of deleted item already marked for deletion
