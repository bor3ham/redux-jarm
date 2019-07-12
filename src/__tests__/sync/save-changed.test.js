import getStore from '../store.js'
import jarm, { customJarm } from '../jarm.js'
import { mockOnceDelay } from '../utils.js'
import { instanceKey } from '../../utils.js'

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
  const initialState = store.getState()

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
    expect(finalState.errors[key]).toBe(undefined)
    // assert no state mutation
    expect(finalState.remote).not.toBe(initialState.remote)
    expect(finalState.remote[testTask1.type]).not.toBe(initialState.remote[testTask1.type])
    expect(finalState.pending).not.toBe(initialState.pending)
    expect(finalState.local).not.toBe(initialState.local)
    expect(finalState.local[testTask1.type]).not.toBe(initialState.local[testTask1.type])

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
  const initialState = store.getState()

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
    expect(finalState.errors[key]).toBe(undefined)
    // assert no state mutation
    expect(finalState.remote).not.toBe(initialState.remote)
    expect(finalState.remote[testTask1.type]).not.toBe(initialState.remote[testTask1.type])
    expect(finalState.pending).not.toBe(initialState.pending)
    expect(finalState.local).not.toBe(initialState.local)
    expect(finalState.local[testTask1.type]).not.toBe(initialState.local[testTask1.type])

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
  const key = instanceKey(testTask1.type, testTask1.id)
  const initialState = store.getState()

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
    // assert no state mutation
    expect(finalState.pending).not.toBe(initialState.pending)
    expect(finalState.errors).not.toBe(initialState.errors)

    done()
  })
})

test('save changed resulting in server error', done => {
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'Trim the hedges',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))
  const key = instanceKey(testTask1.type, testTask1.id)
  const initialState = store.getState()

  const errorResponse = {
    error: 'Internal server error!',
  }
  fetch.mockResponseOnce(JSON.stringify(errorResponse), {status: 500})
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((updated) => {
    fail('Update should have failed')
  }).catch((error) => {
    expect(error.data).toMatchObject(errorResponse)
    const finalState = store.getState()
    expect(finalState.pending[key]).toBeFalsy()
    expect(finalState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
    expect(finalState.errors[key]).toMatchObject(error.data)
     // assert no state mutation
    expect(finalState.pending).not.toBe(initialState.pending)
    expect(finalState.errors).not.toBe(initialState.errors)

    done()
  })
})

test('save changed resulting in transport error, then retry successfully', done => {
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
  const initialState = store.getState()

  fetch.mockRejectOnce(new Error('Some transport error'))
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((updated) => {
    fail('Update should have failed')
  }).catch((error) => {
    const midState = store.getState()
    expect(midState.pending[key]).toBeFalsy()
    expect(midState.local[testTask1.type][testTask1.id]).toMatchObject(changes)
    expect(midState.errors[key]).toBeTruthy()
    // assert no state mutation
    expect(midState.pending).not.toBe(initialState.pending)
    expect(midState.errors).not.toBe(initialState.errors)

    fetch.mockResponseOnce(JSON.stringify({
      data: expectedUpdated,
    }), {status: 200})
    store.dispatch(jarm.save(testTask1.type, testTask1.id)).then(updated => {
      expect(updated).toMatchObject(expectedUpdated)
      const finalState = store.getState()
      expect(finalState.remote[testTask1.type][testTask1.id]).toMatchObject(expectedUpdated)
      expect(testTask1.id in finalState.local[testTask1.type]).toBe(false)
      expect(finalState.pending[key]).toBeFalsy()
      expect(finalState.errors[key]).toBe(undefined)
      // assert no state mutation
      expect(finalState.remote).not.toBe(midState.remote)
      expect(finalState.remote[testTask1.type]).not.toBe(midState.remote[testTask1.type])
      expect(finalState.pending).not.toBe(midState.pending)
      expect(finalState.errors).not.toBe(midState.errors)

      done()
    })
  })
})

test('save an already pending change', () => {
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
  const delay = 200
  mockOnceDelay({
    data: expectedUpdated,
  }, {status: 200}, delay)
  store.dispatch(jarm.save(testTask1.type, testTask1.id))
  expect(() => {
    store.dispatch(jarm.save(testTask1.type, testTask1.id))
  }).toThrow()
})

test('save a changed instance with no schema url', () => {
  const jarm = customJarm({
    schema: {
      Task: {},
    },
  })
  const store = getStore()
  store.dispatch(jarm.populate(testTask1))
  const changes = {
    attributes: {
      name: 'Trim the hedges',
    },
  }
  store.dispatch(jarm.update(testTask1.type, testTask1.id, changes))

  expect(() => {
    store.dispatch(jarm.save(testTask1.type, testTask1.id))
  }).toThrow()
})

// todo: save a changed with ?include foreign key
// todo: save a changed with ?include m2m / rfk
// todo: save a changed with direct reference to local draft object
// todo: save a changed with set reference to local draft object
