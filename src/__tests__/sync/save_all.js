import getStore from '../store.js'
import { customJarm } from '../jarm.js'

const testTask1 = {
  type: 'Task',
  id: 'aaa-001',
  attributes: {
    name: 'Mow the lawn',
  },
}
const testUser1 = {
  type: 'User',
  id: 'bbb-001',
  attributes: {
    name: 'Roberta',
  },
}

test('save all with committed instances that depend on uncommitted instances', () => {
  // create a jarm schema to test across two instance types
  const jarm = customJarm({
    schema: {
      User: {
        url: '/users/',
      },
    },
  })
  const store = getStore()
  // add task 1 to known cache
  store.dispatch(jarm.populate(testTask1))
  // create local user 1
  const createdId = store.dispatch(jarm.create({...testUser1, id: undefined}))
  // change fk on task 1 to local user 1
  store.dispatch(jarm.update(testTask1.type, testTask1.id, {
    relationships: {
      assignee: {
        data: {
          type: 'User',
          id: createdId,
        },
      },
    },
  }))
  store.dispatch(jarm.commit(testTask1.type, testTask1.id))
  // call a save all and expect nothing to happen
  store.dispatch(jarm.save_all())
  expect(Object.keys(store.getState().local).length).toBe(2)
})
