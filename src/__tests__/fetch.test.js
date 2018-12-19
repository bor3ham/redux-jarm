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
const testDetailResponse = {
  data: testTask1,
}
const testListResponse = {
  data: [testTask1, testTask2],
}

test('fetch from a list', done => {
  const store = getStore()
  const oldState = store.getState()
  fetch.mockResponseOnce(
    JSON.stringify(testListResponse),
    {status: 200},
  )
  store.dispatch(jarm.fetch('/tasks', {}, {})).then((response) => {
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
    // expect outermost remote reference to be changed
    expect(oldState.remote).not.toBe(newState.remote)
    done()
  })
})
