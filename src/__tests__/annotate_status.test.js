import getStore from './store.js'
import jarm from './jarm.js'

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
// todo: annotate status of a draft-saving
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
// todo: annotate status of a modified-committed
// todo: annotate status of a modified-saving
// todo: annotate status of a deleted
// todo: annotate status of a deleted-committed
// todo: annotate status of a deleted-saving
