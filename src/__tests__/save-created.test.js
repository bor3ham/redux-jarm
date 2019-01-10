import getStore from './store.js'
import jarm from './jarm.js'
import { mockOnceDelay } from './utils.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}

// todo: save a non-committed created instance

test('save a committed created instance (same id result)', done => {
  const store = getStore()
  store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

  const itemKey = `${testTask1.type}-${testTask1.id}`
  const priorState = store.getState()
  expect(priorState.pending[itemKey]).toBeFalsy()

  const delay = 200
  mockOnceDelay(
    {
      data: testTask1,
    },
    {status: 201},
    delay
  )
  setTimeout(() => {
    const pendingState = store.getState()
    expect(pendingState.pending[itemKey]).toBeTruthy()
  }, delay / 2)
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((created) =>  {
    const completeState = store.getState()
    expect(completeState.pending[itemKey]).toBeFalsy()
    expect(completeState.new[itemKey]).toBeFalsy()
    expect(completeState.local[testTask1.type][testTask1.id]).toBe(undefined)
    expect(completeState.remote[testTask1.type][testTask1.id]).toMatchObject(created)
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
  store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

  const errorResponse = {
    error: 'Internal server error',
  }
  const itemKey = `${testTask1.type}-${testTask1.id}`
  fetch.mockResponseOnce(
    JSON.stringify(errorResponse),
    {status: 500},
  )
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let completeState = store.getState()
    expect(error.data).toMatchObject(errorResponse)
    expect(completeState.errors[itemKey]).toMatchObject(errorResponse)
    expect(completeState.pending[itemKey]).toBeFalsy()
    done()
  })
})

test('save created resulting in complete transport error, then retry successfully', done => {
  const store = getStore()
  store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

  const itemKey = `${testTask1.type}-${testTask1.id}`
  fetch.mockRejectOnce(new Error('Some transport error'))
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expect(erroredState.errors[itemKey]).toBeTruthy()
    expect(erroredState.pending[itemKey]).toBeFalsy()
    fetch.mockResponseOnce(
      JSON.stringify({
        data: testTask1,
      }),
      {status: 201},
    )
    store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((created) => {
      const completeState = store.getState()
      expect(completeState.pending[itemKey]).toBeFalsy()
      expect(completeState.new[itemKey]).toBeFalsy()
      expect(completeState.local[testTask1.type][testTask1.id]).toBe(undefined)
      expect(completeState.remote[testTask1.type][testTask1.id]).toMatchObject(created)
      done()
    })
  })
})

test('save created resulting in perceived transport error, then retry but already exists', done => {
  const store = getStore()
  store.dispatch(jarm.create(testTask1))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))

  const itemKey = `${testTask1.type}-${testTask1.id}`
  fetch.mockRejectOnce(new Error('Some transport error'))
  store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((created) => {
    fail('Should not have been able to create instance')
  }).catch((error) => {
    let erroredState = store.getState()
    expect(error).toBeTruthy()
    expect(erroredState.errors[itemKey]).toBeTruthy()
    expect(erroredState.pending[itemKey]).toBeFalsy()
    fetch.mockResponseOnce(
      JSON.stringify({
        data: testTask1,
      }),
      {status: 409},
    )
    store.dispatch(jarm.save(testTask1.type, testTask1.id)).then((created) => {
      const completeState = store.getState()
      expect(completeState.pending[itemKey]).toBeFalsy()
      expect(completeState.new[itemKey]).toBeFalsy()
      expect(completeState.local[testTask1.type][testTask1.id]).toBe(undefined)
      expect(completeState.remote[testTask1.type][testTask1.id]).toMatchObject(created)
      done()
    })
  })
})

// todo: save created resulting in perceived transport error, then discover instance through fetch
// todo: save an already pending creation
// todo: save a creation with ?include
