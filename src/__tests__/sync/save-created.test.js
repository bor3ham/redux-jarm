import { v4 as uuidv4 } from 'uuid'

import getStore from '../store.js'
import jarm from '../jarm.js'
import { mockOnceDelay, expectInstanceMatches } from '../utils.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
  relationships: {},
}

test('save a committed created instance (same id result)', done => {
  const store = getStore()
  const creatingId = store.dispatch(jarm.create(testTask1))
  const creating = {
    ...testTask1,
    id: creatingId,
  }
  store.dispatch(jarm.commit(testTask1.type, creatingId))

  const priorState = store.getState()
  expectInstanceMatches(priorState, testTask1.type, creatingId, {
    remote: undefined,
    local: creating,
    new: true,
    committed: true,
    pending: false,
    errors: undefined,
  })

  const delay = 200
  mockOnceDelay(
    {
      data: creating,
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) =>  {
    const completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, creatingId, {
      remote: created,
      local: undefined,
      new: false,
      committed: false,
      pending: false,
      errors: undefined,
    })
    done()
  })
  const pendingState = store.getState()
  expectInstanceMatches(pendingState, testTask1.type, creatingId, {
    remote: undefined,
    local: creating,
    new: true,
    committed: true,
    pending: true,
    errors: undefined,
  })
})

test('save a committed created instance (different id result)', done => {
  const store = getStore()
  const localId = store.dispatch(jarm.create(testTask1))
  const local = {
    ...testTask1,
    id: localId,
  }
  store.dispatch(jarm.commit(testTask1.type, localId))

  const priorState = store.getState()
  expectInstanceMatches(priorState, testTask1.type, localId, {
    remote: undefined,
    local: local,
    new: true,
    committed: true,
    pending: false,
    errors: undefined,
  })

  const remoteId = uuidv4()
  const remote = {
    ...testTask1,
    id: remoteId,
  }

  const delay = 200
  mockOnceDelay(
    {
      data: remote,
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, localId)).then((created) =>  {
    const completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, localId, undefined)
    expectInstanceMatches(completeState, testTask1.type, remoteId, {
      remote: created,
      local: undefined,
      new: false,
      committed: false,
      pending: false,
      errors: undefined,
    })
    done()
  })
  const pendingState = store.getState()
  expectInstanceMatches(pendingState, testTask1.type, localId, {
    remote: undefined,
    local: local,
    new: true,
    committed: true,
    pending: true,
    errors: undefined,
  })
})

test('save a non-committed created instance', done => {
  const store = getStore()
  const creatingId = store.dispatch(jarm.create(testTask1))
  const creating = {
    ...testTask1,
    id: creatingId,
  }

  const delay = 200
  mockOnceDelay(
    {
      data: creating,
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) =>  {
    const completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, creatingId, {
      remote: created,
      local: undefined,
      new: false,
      committed: false,
      pending: false,
      errors: undefined,
    })
    done()
  })
  const pendingState = store.getState()
  expectInstanceMatches(pendingState, testTask1.type, creatingId, {
    remote: undefined,
    local: creating,
    new: true,
    committed: true,
    pending: true,
    errors: undefined,
  })
})

// todo: save a created instance with no schema url
// todo: save a non existent instance
// todo: save created resulting in bad request

test('save created resulting in server error', done => {
  const store = getStore()
  const creatingId = store.dispatch(jarm.create(testTask1))
  const creating = {
    ...testTask1,
    id: creatingId,
  }
  store.dispatch(jarm.commit(testTask1.type, creatingId))

  const errorResponse = {
    error: 'Internal server error',
  }
  fetch.mockResponseOnce(
    JSON.stringify(errorResponse),
    {status: 500},
  )
  store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, creatingId, {
      remote: undefined,
      local: creating,
      new: true,
      committed: true,
      pending: false,
      errors: errorResponse,
    })
    done()
  })
})

test('save created resulting in complete transport error, then retry successfully', done => {
  const store = getStore()
  const creatingId = store.dispatch(jarm.create(testTask1))
  const creating = {
    ...testTask1,
    id: creatingId,
  }
  store.dispatch(jarm.commit(testTask1.type, creatingId))

  const transportError = new Error('Some transport error')
  fetch.mockRejectOnce(transportError)
  store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expectInstanceMatches(erroredState, testTask1.type, creatingId, {
      remote: undefined,
      local: creating,
      new: true,
      committed: true,
      pending: false,
      errors: transportError,
    })
    fetch.mockResponseOnce(
      JSON.stringify({
        data: creating,
      }),
      {status: 201},
    )
    store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) => {
      const completeState = store.getState()
      expectInstanceMatches(completeState, testTask1.type, creatingId, {
        remote: created,
        local: undefined,
        new: false,
        committed: false,
        pending: false,
        errors: undefined,
      })
      done()
    })
  })
})

test('save created resulting in perceived transport error, then retry but already exists', done => {
  const store = getStore()
  const creatingId = store.dispatch(jarm.create(testTask1))
  const creating = {
    ...testTask1,
    id: creatingId,
  }
  store.dispatch(jarm.commit(testTask1.type, creatingId))

  const transportError = new Error('Some transport error')
  fetch.mockRejectOnce(transportError)
  store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    expect(error).toBeTruthy()
    const erroredState = store.getState()
    expectInstanceMatches(erroredState, testTask1.type, creatingId, {
      remote: undefined,
      local: creating,
      new: true,
      committed: true,
      pending: false,
      errors: transportError,
    })
    fetch.mockResponseOnce(
      JSON.stringify({
        data: creating,
      }),
      {status: 409},
    )
    store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) => {
      const completeState = store.getState()
      expectInstanceMatches(completeState, testTask1.type, creatingId, {
        remote: created,
        local: undefined,
        new: false,
        committed: false,
        pending: false,
        errors: undefined,
      })
      done()
    })
  })
})

test(
  'save created resulting in perceived transport error, then discover instance through fetch',
  done => {
    const store = getStore()
    const creatingId = store.dispatch(jarm.create(testTask1))
    const creating = {
      ...testTask1,
      id: creatingId,
    }
    store.dispatch(jarm.commit(testTask1.type, creatingId))

    const transportError = new Error('Some transport error')
    fetch.mockRejectOnce(transportError)
    store.dispatch(jarm.save(testTask1.type, creatingId)).then((created) => {
      fail('Should not have been able to create instance')
    }).catch((error) => {
      let erroredState = store.getState()
      expect(error).toBeTruthy()
      expectInstanceMatches(erroredState, testTask1.type, creatingId, {
        remote: undefined,
        local: creating,
        new: true,
        committed: true,
        pending: false,
        errors: transportError,
      })

      const listResponse = {
        data: [
          {
            ...testTask1,
            id: creatingId,
          },
        ],
      }
      fetch.mockResponseOnce(
        JSON.stringify(listResponse),
        {status: 200},
      )
      store.dispatch(jarm.fetch('/tasks', {})).then((response) => {
        // make sure the mock worked
        expect(response.data).toMatchObject(listResponse)
        // expect item to be in the remote and cleared from local
        const finalState = store.getState()
        expectInstanceMatches(finalState, testTask1.type, creatingId, {
          remote: creating,
          local: undefined,
          new: false,
          committed: false,
          pending: false,
          errors: undefined,
        })
        done()
      })
    })
  }
)

test('save an already pending creation', () => {
  const store = getStore()
  const creatingId = store.dispatch(jarm.create(testTask1))
  const creating = {
    ...testTask1,
    id: creatingId,
  }
  store.dispatch(jarm.commit(testTask1.type, creatingId))

  const delay = 200
  mockOnceDelay(
    {
      data: creating,
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, creatingId))
  expect(() => {
    store.dispatch(jarm.save(testTask1.type, creatingId))
  }).toThrow()
})

// todo: save a creation with ?include
// todo: save a creation with direct reference to local draft object
// todo: save a creation with set reference to local draft object
