import getStore from './store.js'
import jarm from './jarm.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
  relationships: {
    assignee: {
      data: {
        type: 'User',
        id: 'bbb-001',
      },
    },
  },
}

test('update single new attribute on existing instance', () => {
  const store = getStore()
  // create the existing instance
  store.dispatch(jarm.populate(testTask1))

  // update it
  const oldState = store.getState()
  const changes = {
    attributes: {
      name: 'Something else',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const newState = store.getState()
  // make sure there has been no object mutation
  expect(newState.local).not.toBe(oldState.local)
  expect(newState.local[testTask1.type]).not.toBe(oldState.local[testTask1.type])
  // expect the changes to be reflected in state
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
  // and expect the relationships to be unchanged
  expect(newState.local[testTask1.type][testTask1.id].relationships).toMatchObject({})
})
test('update single new relationship on existing instance', () => {
  const store = getStore()
  // create the existing instance
  store.dispatch(jarm.populate(testTask1))

  // update it
  const oldState = store.getState()
  const changes = {
    relationships: {
      assignee: {
        data: null,
      },
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const newState = store.getState()
  // make sure there has been no object mutation
  expect(newState.local).not.toBe(oldState.local)
  expect(newState.local[testTask1.type]).not.toBe(oldState.local[testTask1.type])
  // expect the changes to be reflected in state
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
  // and expect the attributes to be unchanged
  expect(newState.local[testTask1.type][testTask1.id].attributes).toMatchObject({})
})
test('update same attribute twice', () => {
  const store = getStore()
  // create the existing instance
  store.dispatch(jarm.populate(testTask1))

  // update it
  const initialState = store.getState()
  const firstChanges = {
    attributes: {
      name: 'Something else',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, firstChanges))
  const firstChangesState = store.getState()
  // update it again
  const secondChanges = {
    attributes: {
      name: 'And changed again',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, secondChanges))
  const secondChangesState = store.getState()
  // make sure there has been no object mutation
  expect(secondChangesState.local).not.toBe(firstChangesState.local)
  expect(secondChangesState.local[testTask1.type]).not.toBe(firstChangesState.local[testTask1.type])
  // expect the changes to be reflected in state
  expect(secondChangesState.local[testTask1.type][testTask1.id]).toMatchObject(secondChanges)
})
test('update a committed instance (not pending)', () => {
  const store = getStore()
  // create the existing instance
  store.dispatch(jarm.populate(testTask1))

  // update it
  const initialChanges = {
    attributes: {
      name: 'Something else',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, initialChanges))
  // commit to the changes
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

  const oldState = store.getState()
  const laterChanges = {
    attributes: {
      name: 'Another name',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, laterChanges))
  const newState = store.getState()
  // make sure there has been no object mutation
  expect(newState.local).not.toBe(oldState.local)
  expect(newState.local[testTask1.type]).not.toBe(oldState.local[testTask1.type])
  expect(newState.local[testTask1.type][testTask1.id]).not.toBe(oldState.local[testTask1.type][testTask1.id])
  // expect the changes to be reflected
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(laterChanges)
  // expect the instance to no longer be committed
  const key = `${testTask1.type}-${testTask1.id}`
  expect(newState.committed[key]).toBeFalsy()
})
// todo: update a committed instance (pending)
// todo: update an instance marked for deletion
// todo: update an instance that does not exist
