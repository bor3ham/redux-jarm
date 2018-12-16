import getStore from './store.js'
import jarm from './jarm.js'

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
  // expect outermost remote reference to be changed
  expect(oldState.remote).not.toBe(newState.remote)
})

test('populate twice from individual', () => {
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
  // expect outermost remote reference to be changed
  expect(oldState.remote).not.toBe(middleState.remote)
  expect(middleState.remote).not.toBe(newState.remote)
  // expect type reference to have changed on the second call
  expect(middleState.remote[testTask1.type]).not.toBe(newState.remote[testTask1.type])
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
  // expect outermost remote reference to be changed
  expect(oldState.remote).not.toBe(newState.remote)
})
