import getStore from '../store.js'
import jarm from '../jarm.js'
import { mockOnceDelay } from '../utils.js'
import { instanceKey } from '../../utils.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}

test('discard uncommitted new instance', () => {
  const store = getStore()

  const createData = {
    type: 'Task',
    attributes: {
      name: 'Mow the lawn',
    },
  }
  const newId = store.dispatch(jarm.create(createData))
  const key = instanceKey(createData.type, newId)

  const priorState = store.getState()
  store.dispatch(jarm.discard(createData.type, newId))
  const endState = store.getState()

  expect(endState.local[createData.type][newId]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
  // assert no state mutation
  expect(endState.local).not.toBe(priorState.local)
  expect(endState.local[createData.type]).not.toBe(priorState.local[createData.type])
})

test('discard committed new instance', () => {
  const store = getStore()

  const createData = {
    type: 'Task',
    attributes: {
      name: 'Mow the lawn',
    },
  }
  const newId = store.dispatch(jarm.create(createData))
  store.dispatch(jarm.commit(createData.type, newId))
  const key = instanceKey(createData.type, newId)

  const priorState = store.getState()
  store.dispatch(jarm.discard(createData.type, newId))
  const endState = store.getState()

  expect(endState.local[createData.type][newId]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
  // assert no state mutation
  expect(endState.local).not.toBe(priorState.local)
  expect(endState.committed).not.toBe(priorState.committed)
  expect(endState.local[createData.type]).not.toBe(priorState.local[createData.type])
})

test('discard pending new instance', () => {
  const store = getStore()

  const createData = {
    type: 'Task',
    attributes: {
      name: 'Mow the lawn',
    },
  }
  const newId = store.dispatch(jarm.create(createData))

  const delay = 200
  mockOnceDelay({
    data: {
      ...createData,
      id: newId,
    },
  }, {status: 201}, delay)
  store.dispatch(jarm.save(createData.type, newId))
  expect(() => {
    store.dispatch(jarm.discard(createData.type, newId))
  }).toThrow()
})

test('discard uncommitted changed instance', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const key = instanceKey(testTask1.type, testTask1.id)

  const priorState = store.getState()
  store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  const endState = store.getState()

  expect(endState.local[testTask1.type][testTask1.id]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
  expect(endState.remote[testTask1.type][testTask1.id]).toMatchObject(testTask1)
  // assert no state mutation
  expect(endState.local).not.toBe(priorState.local)
  expect(endState.local[testTask1.type]).not.toBe(priorState.local[testTask1.type])
})

test('discard committed changed instance', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const key = instanceKey(testTask1.type, testTask1.id)
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

  const priorState = store.getState()
  store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  const endState = store.getState()

  expect(endState.local[testTask1.type][testTask1.id]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
  expect(endState.remote[testTask1.type][testTask1.id]).toMatchObject(testTask1)
  // assert no state mutation
  expect(endState.local).not.toBe(priorState.local)
  expect(endState.local[testTask1.type]).not.toBe(priorState.local[testTask1.type])
  expect(endState.committed).not.toBe(priorState.committed)
})

test('discard pending changed instance', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'A new name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))

  const delay = 200
  const expectedUpdated = {
    ...testTask1,
    attributes: {
      ...testTask1.attributes,
      ...changes.attributes,
    },
  }
  mockOnceDelay({
    data: expectedUpdated,
  }, {status: 200}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id))
  expect(() => {
    store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  }).toThrow()
})

test('discard uncommitted instance deletion', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  const key = instanceKey(testTask1.type, testTask1.id)

  const priorState = store.getState()
  store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  const endState = store.getState()

  expect(endState.local[testTask1.type][testTask1.id]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
  expect(endState.remote[testTask1.type][testTask1.id]).toMatchObject(testTask1)
  // assert no state mutation
  expect(endState.local).not.toBe(priorState.local)
  expect(endState.local[testTask1.type]).not.toBe(priorState.local[testTask1.type])
})

test('discard committed instance deletion', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  const key = instanceKey(testTask1.type, testTask1.id)

  const priorState = store.getState()
  store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  const endState = store.getState()

  expect(endState.local[testTask1.type][testTask1.id]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
  expect(endState.remote[testTask1.type][testTask1.id]).toMatchObject(testTask1)
  // assert no state mutation
  expect(endState.local).not.toBe(priorState.local)
  expect(endState.local[testTask1.type]).not.toBe(priorState.local[testTask1.type])
  expect(endState.committed).not.toBe(priorState.committed)
})

test('discard pending instance deletion', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))

  const delay = 200
  mockOnceDelay({}, {status: 204}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id))
  expect(() => {
    store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  }).toThrow()
})

test('discard unchanged instance', () => {
  const store = getStore()
  const key = instanceKey(testTask1.type, testTask1.id)

  store.dispatch(jarm.discard(testTask1.type, testTask1.id))
  const endState = store.getState()
  expect(endState.local[testTask1.type][testTask1.id]).toBe(undefined)
  expect(endState.committed[key]).toBeFalsy()
})
