import getStore from '../store.js'
import jarm from '../jarm.js'
import { instanceKey } from '../../utils.js'

const testTask1 = {
  id: 'aaa-001',
  type: 'Task',
  attributes: {
    name: 'Mow the lawn',
  },
}

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
  const key = `${createData.type}-${newId}`
  const newState = store.getState()
  // expect new instance still saved and marked as committed
  expect(newState.local[createData.type][newId]).toMatchObject(createData)
  expect(newState.committed[key]).toBeTruthy()
  // make sure no object mutation has happened
  expect(oldState.committed).not.toBe(newState.committed)
})

test('commit changes to existing instance', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  const key = instanceKey(testTask1.type, testTask1.id)
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const oldState = store.getState()
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  const newState = store.getState()
  // assert changes still saved and instance is marked as committed
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
  expect(newState.committed[key]).toBeTruthy()
  // make sure no object mutation has happened
  expect(newState.committed).not.toBe(oldState.committed)
})

test('commit changes to instance that does not exist', () => {
  const store = getStore()
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  const key = instanceKey(testTask1.type, testTask1.id)
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const oldState = store.getState()
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  const newState = store.getState()
  // assert changes still saved and instance is marked as committed
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
  expect(newState.committed[key]).toBeTruthy()
  // make sure no object mutation has happened
  expect(newState.committed).not.toBe(oldState.committed)
})

test('commit to a local deletion of known instance', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const key = instanceKey(testTask1.type, testTask1.id)
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  const oldState = store.getState()
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  const newState = store.getState()
  // assert changes still saved and instance is marked as committed
  expect(newState.local[testTask1.type][testTask1.id]).toBe(false)
  expect(newState.committed[key]).toBeTruthy()
  // make sure no object mutation has happened
  expect(newState.committed).not.toBe(oldState.committed)
})

test('commit to a local deletion of unknown instance', () => {
  const store = getStore()
  const key = instanceKey(testTask1.type, testTask1.id)
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  const oldState = store.getState()
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  const newState = store.getState()
  // assert changes still saved and instance is marked as committed
  expect(newState.local[testTask1.type][testTask1.id]).toBe(false)
  expect(newState.committed[key]).toBeTruthy()
  // make sure no object mutation has happened
  expect(newState.committed).not.toBe(oldState.committed)
})
