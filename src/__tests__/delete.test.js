import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// todo: delete unchanged instance
// todo: delete uncommitted changed instance
// todo: delete committed changed instance (not pending)
// todo: delete committed changed instance (pending)
// todo: delete instance that does not exist
