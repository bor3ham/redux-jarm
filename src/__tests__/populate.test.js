import store from './store.js'
import jarm from './jarm.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}

store.dispatch(jarm.populate(testTask1))
console.log(store.getState())
test('populate individual', () => {
  expect(store.getState()).toMatchObject({
    'remote': {
      'Task': {
        'aaa-001': testTask1,
      },
    },
  })
})
