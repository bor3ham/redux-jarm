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

test('placeholder', () => {
  const store = getStore()
})

// todo: save a deletion
// todo: save a deletion where instance has other relations in store
// todo: save a deletion resulting in bad request
// todo: save a deletion resulting in server error
// todo: save an already pending deletion
// todo: save a changed instance with no schema url
