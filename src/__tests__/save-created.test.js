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

test('save a committed created instance (same id result)', done => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const key = instanceKey(testTask1.type, createdId)
  const priorState = store.getState()
  expect(priorState.pending[key]).toBeFalsy()

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
    expect(completeState.pending[key]).toBeFalsy()
    expect(completeState.new[key]).toBeFalsy()
    expect(completeState.local[testTask1.type][createdId]).toBe(undefined)
    expect(completeState.remote[testTask1.type][createdId]).toMatchObject(created)
    done()
  })
  const pendingState = store.getState()
  expect(pendingState.pending[key]).toBeTruthy()
})

test('save a non-committed created instance', done => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))

  const key = instanceKey(testTask1.type, createdId)

  fetch.mockResponseOnce(
    {
      data: {
        ...testTask1,
        id: createdId,
      },
    },
    {status: 201},
  )
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) =>  {
    const completeState = store.getState()
    expect(completeState.pending[key]).toBeFalsy()
    expect(completeState.new[key]).toBeFalsy()
    expect(completeState.local[testTask1.type][createdId]).toBe(undefined)
    expect(completeState.remote[testTask1.type][createdId]).toMatchObject(created)
    done()
  })
})

test('save a commited created instance (different id result)', () => {
  const store = getStore()
  // todo: finish
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
  const key = instanceKey(testTask1.type, createdId)
  fetch.mockResponseOnce(
    JSON.stringify(errorResponse),
    {status: 500},
  )
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let completeState = store.getState()
    expect(error.data).toMatchObject(errorResponse)
    expect(completeState.errors[key]).toMatchObject(errorResponse)
    expect(completeState.pending[key]).toBeFalsy()
    done()
  })
})

test('save created resulting in complete transport error, then retry successfully', done => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const key = instanceKey(testTask1.type, createdId)
  fetch.mockRejectOnce(new Error('Some transport error'))
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expect(erroredState.errors[key]).toBeTruthy()
    expect(erroredState.pending[key]).toBeFalsy()
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
      expect(completeState.pending[key]).toBeFalsy()
      expect(completeState.new[key]).toBeFalsy()
      expect(completeState.local[testTask1.type][createdId]).toBe(undefined)
      expect(completeState.remote[testTask1.type][createdId]).toMatchObject(created)
      done()
    })
  })
})

test('save created resulting in perceived transport error, then retry but already exists', done => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const key = instanceKey(testTask1.type, createdId)
  fetch.mockRejectOnce(new Error('Some transport error'))
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expect(erroredState.errors[key]).toBeTruthy()
    expect(erroredState.pending[key]).toBeFalsy()
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
      expect(completeState.pending[key]).toBeFalsy()
      expect(completeState.new[key]).toBeFalsy()
      expect(completeState.local[testTask1.type][createdId]).toBe(undefined)
      expect(completeState.remote[testTask1.type][createdId]).toMatchObject(created)
      done()
    })
  })
})

test('save created resulting in perceived transport error, then discover instance through fetch', done => {
  const store = getStore()
  const createdId = store.dispatch(jarm.create(testTask1))
  const created = {
    ...testTask1,
    id: createdId,
  }
  store.dispatch(jarm.commit(testTask1.type, createdId))

  const key = instanceKey(testTask1.type, createdId)
  fetch.mockRejectOnce(new Error('Some transport error'))
  store.dispatch(jarm.save(testTask1.type, createdId)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expect(erroredState.errors[key]).toBeTruthy()
    expect(erroredState.pending[key]).toBeFalsy()

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
      expect(finalState.remote[testTask1.type][createdId]).toMatchObject(created)
      expect(createdId in finalState.local[testTask1.type]).toBe(false)
      expect(finalState.new[key]).toBeFalsy()
      done()
    })
  })
})

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
