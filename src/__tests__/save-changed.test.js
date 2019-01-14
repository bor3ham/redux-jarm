import getStore from './store.js'
import jarm from './jarm.js'
import { mockOnceDelay } from './utils.js'
import { instanceKey } from '../utils.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}

test('save a committed changed instance', done => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'Trim the hedges',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  const expectedUpdated = {
    ...testTask1,
    attributes: {
      ...testTask1.attributes,
      ...changes.attributes,
    },
  }
  const key = instanceKey(testTask1.type, testTask1.id)
  const delay = 200
  mockOnceDelay({
    data: expectedUpdated,
  }, {status: 200}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((updated) => {
    expect(updated).toMatchObject(expectedUpdated)
    const finalState = store.getState()
    expect(finalState.remote[testTask1.type][testTask1.id]).toMatchObject(expectedUpdated)
    expect(testTask1.id in finalState.local[testTask1.type]).toBe(false)
    expect(finalState.pending[key]).toBeFalsy()
    done()
  })
  const pendingState = store.getState()
  expect(pendingState.pending[key]).toBeTruthy()
})

test('save a non-committed changed instance', done => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'Trim the hedges',
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
  const key = instanceKey(testTask1.type, testTask1.id)
  const delay = 200
  mockOnceDelay({
    data: expectedUpdated,
  }, {status: 200}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((updated) => {
    expect(updated).toMatchObject(expectedUpdated)
    const finalState = store.getState()
    expect(finalState.remote[testTask1.type][testTask1.id]).toMatchObject(expectedUpdated)
    expect(testTask1.id in finalState.local[testTask1.type]).toBe(false)
    expect(finalState.pending[key]).toBeFalsy()
    done()
  })
  const pendingState = store.getState()
  expect(pendingState.pending[key]).toBeTruthy()
})

test('save changed resulting in bad request', done => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'Trim the hedges',
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
  const key = instanceKey(testTask1.type, testTask1.id)
  const errorResponse = {
    error: 'That name is not allowed.',
  }
  fetch.mockResponseOnce(JSON.stringify(errorResponse), {status: 400})
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((updated) => {
    fail('Update should have failed')
  }).catch((error) => {
    expect(error.data).toMatchObject(errorResponse)
    const finalState = store.getState()
    expect(finalState.pending[key]).toBeFalsy()
    expect(finalState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
    expect(finalState.errors[key]).toMatchObject(error.data)
    done()
  })
})

// todo: save changed resulting in server error
// todo: save changed resulting in transport error, then retry successfully
// todo: save an already pending change
// todo: save a changed instance with no schema url
// todo: save a changed with ?include
