import uuidv4 from 'uuid/v4'

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
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const priorState = store.getState()
  expectInstanceMatches(priorState, testTask1.type, createdId, {
    remote: undefined,
    local: {
      ...testTask1,
      id: createdId,
    },
    new: true,
    committed: true,
    pending: false,
    errors: undefined,
  })

  const delay = 200
  mockOnceDelay(
    {
      data: {
        ...testTask1,
        id: createdId,
      },
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) =>  {
    const completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, createdId, {
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
  expectInstanceMatches(pendingState, testTask1.type, createdId, {
    remote: undefined,
    local: {
      ...testTask1,
      id: createdId,
    },
    new: true,
    committed: true,
    pending: true,
    errors: undefined,
  })
})

test('save a committed created instance (different id result)', done => {
  const store = getStore()
  const localId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, localId))

  const priorState = store.getState()
  expectInstanceMatches(priorState, testTask1.type, localId, {
    remote: undefined,
    local: {
      ...testTask1,
      id: localId,
    },
    new: true,
    committed: true,
    pending: false,
    errors: undefined,
  })

  const remoteId = uuidv4()

  const delay = 200
  mockOnceDelay(
    {
      data: {
        ...testTask1,
        id: remoteId,
      },
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
    local: {
      ...testTask1,
      id: localId,
    },
    new: true,
    committed: true,
    pending: true,
    errors: undefined,
  })
})

test('save a non-committed created instance', done => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))

  const delay = 200
  mockOnceDelay(
    {
      data: {
        ...testTask1,
        id: createdId,
      },
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) =>  {
    const completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, createdId, {
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
  expectInstanceMatches(pendingState, testTask1.type, createdId, {
    remote: undefined,
    local: {
      ...testTask1,
      id: createdId,
    },
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
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const errorResponse = {
    error: 'Internal server error',
  }
  fetch.mockResponseOnce(
    JSON.stringify(errorResponse),
    {status: 500},
  )
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let completeState = store.getState()
    expectInstanceMatches(completeState, testTask1.type, createdId, {
      remote: undefined,
      local: {
        ...testTask1,
        id: createdId,
      },
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
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const transportError = new Error('Some transport error')
  fetch.mockRejectOnce(transportError)
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expectInstanceMatches(erroredState, testTask1.type, createdId, {
      remote: undefined,
      local: {
        ...testTask1,
        id: createdId,
      },
      new: true,
      committed: true,
      pending: false,
      errors: transportError,
    })
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          ...testTask1,
          id: createdId,
        },
      }),
      {status: 201},
    )
    store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
      const completeState = store.getState()
      expectInstanceMatches(completeState, testTask1.type, createdId, {
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
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const transportError = new Error('Some transport error')
  fetch.mockRejectOnce(transportError)
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    expect(error).toBeTruthy()
    const erroredState = store.getState()
    expectInstanceMatches(erroredState, testTask1.type, createdId, {
      remote: undefined,
      local: {
        ...testTask1,
        id: createdId,
      },
      new: true,
      committed: true,
      pending: false,
      errors: transportError,
    })
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          ...testTask1,
          id: createdId,
        },
      }),
      {status: 409},
    )
    store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
      const completeState = store.getState()
      expectInstanceMatches(completeState, testTask1.type, createdId, {
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
    const createdId = store.dispatch(jarm.create(testTask1))
    const created = {
      ...testTask1,
      id: createdId,
    }
    store.dispatch(jarm.commit(testTask1.type, createdId))

    const transportError = new Error('Some transport error')
    fetch.mockRejectOnce(transportError)
    store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
      fail('Should not have been able to create instance')
    }).catch((error) => {
      let erroredState = store.getState()
      expect(error).toBeTruthy()
      expectInstanceMatches(erroredState, testTask1.type, createdId, {
        remote: undefined,
        local: created,
        new: true,
        committed: true,
        pending: false,
        errors: transportError,
      })

      const listResponse = {
        data: [
          {
            ...testTask1,
            id: createdId,
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
        expectInstanceMatches(finalState, testTask1.type, createdId, {
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
  }
)

test('save an already pending creation', () => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const delay = 200
  mockOnceDelay(
    {
      data: {
        ...testTask1,
        id: createdId,
      },
    },
    {status: 201},
    delay
  )
  store.dispatch(jarm.save(testTask1.type, createdId))
  expect(() => {
    store.dispatch(jarm.save(testTask1.type, createdId))
  }).toThrow()
})

// todo: save a creation with ?include
// todo: save a creation with direct reference to local draft object
// todo: save a creation with set reference to local draft object
