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

test('annotate status onto a null', () => {
  const store = getStore()
  expect(jarm.annotate_status(store, null)).toBe(null)
})

test('annotate status of an unchanged', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('unchanged')
})

test('annotate status of instance with no type', () => {
  const store = getStore()
  expect(() => {
    jarm.annotate_status(store, {
      id: testTask1.id,
    })
  }).toThrow()
})

test('annotate status of instance with no id', () => {
  const store = getStore()
  expect(() => {
    jarm.annotate_status(store, {
      type: testTask1.type,
    })
  }).toThrow()
})

test('annotate status of a draft', () => {
  const store = getStore()
  const newId = store.dispatch(jarm.create(testTask1))
  const created = {
    ...testTask1,
    id: newId,
  }
  expect(jarm.annotate_status(store, created)[jarm.statusKey]).toBe('draft')
})

test('annotate status of a committed draft', () => {
  const store = getStore()
  const newId = store.dispatch(jarm.create(testTask1))
  const created = {
    ...testTask1,
    id: newId,
  }
  store.dispatch(jarm.commit(created.type, created.id))
  expect(jarm.annotate_status(store, created)[jarm.statusKey]).toBe('draft-committed')
})

test('annotate status of a draft-pending', () => {
  const store = getStore()
  const newId = store.dispatch(jarm.create(testTask1))
  const created = {
    ...testTask1,
    id: newId,
  }
  const delay = 200
  mockOnceDelay({
    data: created,
  }, {status: 201}, delay)
  store.dispatch(jarm.save(created.type, created.id))
  expect(jarm.annotate_status(store, created)[jarm.statusKey]).toBe('draft-pending')
})

test('annotate status of modified', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.update(testTask1.type, testTask1.id, {
    attributes: {
      name: 'A changed name',
    },
  }))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('modified')
})

test('annotate status of modified-committed', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.update(testTask1.type, testTask1.id, {
    attributes: {
      name: 'A changed name',
    },
  }))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('modified-committed')
})

test('annotate status of a modified-pending', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'A changed name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const expectedUpdated = {
    ...testTask1,
    attributes: {
      ...testTask1.attributes,
      ...changes.attributes,
    },
  }
  const delay = 200
  mockOnceDelay({
    data: expectedUpdated,
  }, {status: 200}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('modified-pending')
})

test('annotate status of deleted', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('deleted')
})

test('annotate status of deleted-committed', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('deleted-committed')
})

test('annotate status of a deleted-pending', () => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  store.dispatch(jarm.delete(testTask1.type, testTask1.id))
  const delay = 200
  mockOnceDelay({
    data: {},
  }, {status: 204}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id))
  expect(jarm.annotate_status(store, testTask1)[jarm.statusKey]).toBe('deleted-pending')
})
