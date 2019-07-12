import getStore from '../store.js'
import jarm from '../jarm.js'
import { mockOnceDelay } from '../utils.js'

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
  // expect the changes to be reflected in state
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
  // and expect the relationships to be unchanged
  expect(newState.local[testTask1.type][testTask1.id].relationships).toMatchObject({})
  // make sure there has been no object mutation
  expect(newState.local).not.toBe(oldState.local)
  expect(newState.local[testTask1.type]).not.toBe(oldState.local[testTask1.type])
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
  // expect the changes to be reflected in state
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
  // and expect the attributes to be unchanged
  expect(newState.local[testTask1.type][testTask1.id].attributes).toMatchObject({})
  // make sure there has been no object mutation
  expect(newState.local).not.toBe(oldState.local)
  expect(newState.local[testTask1.type]).not.toBe(oldState.local[testTask1.type])
})

// todo: update an instance that does not exist

test('update same attribute twice', () => {
  const store = getStore()
  // create the existing instance
  store.dispatch(jarm.populate(testTask1))

  // update it
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
  // expect the changes to be reflected in state
  expect(secondChangesState.local[testTask1.type][testTask1.id]).toMatchObject(secondChanges)
  // make sure there has been no object mutation
  expect(secondChangesState.local).not.toBe(firstChangesState.local)
  expect(secondChangesState.local[testTask1.type]).not.toBe(firstChangesState.local[testTask1.type])
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
  // expect the changes to be reflected
  expect(newState.local[testTask1.type][testTask1.id]).toMatchObject(laterChanges)
  // expect the instance to no longer be committed
  const key = `${testTask1.type}-${testTask1.id}`
  expect(newState.committed[key]).toBeFalsy()
  // make sure there has been no object mutation
  expect(newState.local).not.toBe(oldState.local)
  expect(newState.local[testTask1.type]).not.toBe(oldState.local[testTask1.type])
  expect(newState.local[testTask1.type][testTask1.id]).not.toBe(
    oldState.local[testTask1.type][testTask1.id]
  )
})

test('update a committed instance (pending)', () => {
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

  // save the changes
  const delay = 200
  mockOnceDelay(
    {
      data: {
        ...testTask1,
        attributes: {
          ...testTask1.attributes,
          ...initialChanges.attributes,
        },
      },
    },
    {status: 200},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, testTask1.id))

  const laterChanges = {
    attributes: {
      name: 'Another name',
    },
  }
  expect(() => {
    store.dispatch(jarm.update(testTask1.type, testTask1.id, laterChanges))
  }).toThrow()
})

// todo: update an instance marked for deletion
