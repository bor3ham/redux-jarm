import getStore from '../store.js'
import jarm from '../jarm.js'
import { mockOnceDelay } from '../utils.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}

test('delete known unchanged instance', () => {
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

test('delete unknown unchanged instance', () => {
  const store = getStore()

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

test('delete uncommitted changed instance', () => {
  const store = getStore()
  // create the initial data
  store.dispatch(jarm.populate(testTask1))
  // make changes
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))

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

test('delete committed changed instance', () => {
  const store = getStore()
  // create the initial data
  store.dispatch(jarm.populate(testTask1))
  // make changes
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  // commit to changes
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

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

test('delete pending changed instance', () => {
  const store = getStore()
  // create the initial data
  store.dispatch(jarm.populate(testTask1))
  // make changes
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  const expectedUpdated = {
    ...testTask1,
    attributes: {
      ...testTask1.attributes,
      ...changes.attributes,
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  // save changes
  const delay = 200
  mockOnceDelay(
    {
      data: expectedUpdated,
    },
    {status: 200},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, testTask1.id))

  // delete it
  expect(() => {
    store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  }).toThrow()
})
