import getStore from './store.js'
import jarm from './jarm.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}
const testTask2 = {
  type: 'Task',
  id: 'aaa-002',
  attributes: {
    name: 'Trim the hedges',
  },
}
const testSite1 = {
  type: 'Site',
  id: 'aaa-003',
  attributes: {
    name: 'Uptick HQ',
  },
}
const testDetailResponse = {
  data: testTask1,
}
const testListResponse = {
  data: [testTask1, testTask2],
}
const testListWithIncludeResponse = {
  data: [testTask1],
  included: [testSite1],
}

test('fetch from a list', done => {
  const store = getStore()
  const oldState = store.getState()
  fetch.mockResponseOnce(
    JSON.stringify(testListResponse),
    {status: 200},
  )
  store.dispatch(jarm.fetch('/tasks/', {}, {})).then((response) => {
    expect(response.data).toMatchObject(testListResponse)
    const newState = store.getState()
    expect(newState).toMatchObject({
      'remote': {
        [testTask1.type]: {
          [testTask1.id]: testTask1,
          [testTask2.id]: testTask2,
        },
      },
    })
    // expect state to have not been mutated
    expect(oldState.remote).not.toBe(newState.remote)
    done()
  })
})
test('fetch from a detail', done => {
  const store = getStore()
  const oldState = store.getState()
  fetch.mockResponseOnce(
    JSON.stringify(testDetailResponse),
    {status: 200},
  )
  store.dispatch(jarm.fetch('/tasks/aaa-001/', {}, {})).then((response) => {
    expect(response.data).toMatchObject(testDetailResponse)
    const newState = store.getState()
    expect(newState).toMatchObject({
      'remote': {
        [testTask1.type]: {
          [testTask1.id]: testTask1,
        },
      },
    })
    // expect state to have not been mutated
    expect(oldState.remote).not.toBe(newState.remote)
    done()
  })
})
test('fetch from a list with an include', done => {
  const store = getStore()
  const oldState = store.getState()
  fetch.mockResponseOnce(
    JSON.stringify(testListWithIncludeResponse),
    {status: 200},
  )
  store.dispatch(jarm.fetch('/tasks/?include=site', {}, {})).then((response) => {
    expect(response.data).toMatchObject(testListWithIncludeResponse)
    const newState = store.getState()
    expect(newState).toMatchObject({
      'remote': {
        [testTask1.type]: {
          [testTask1.id]: testTask1,
        },
        [testSite1.type]: {
          [testSite1.id]: testSite1,
        },
      },
    })
    // expect state to have not been mutated
    expect(oldState.remote).not.toBe(newState.remote)
    done()
  })
})
test('fetch 404', done => {
  const store = getStore()
  fetch.mockResponseOnce(
    JSON.stringify({
      error: 'Object not found',
    }),
    {status: 404},
  )
  store.dispatch(jarm.fetch('/tasks/aaa-003/', {}, {})).then((response) => {
    fail(response)
    done()
  }).catch((error) => {
    done()
  })
})

// todo: fetch an item that is unchanged locally but has been remotely deleted
// todo: fetch an item that is changed locally but has been remotely deleted
