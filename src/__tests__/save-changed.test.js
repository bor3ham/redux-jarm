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

// todo: save a non-committed changed instance
// todo: save a committed changed instance
// todo: save changed resulting in bad request
// todo: save changed resulting in server error
// todo: save changed resulting in transport error, then retry successfully
// todo: save an already pending change
// todo: save a changed instance with no schema url
// todo: save a changed with ?include
