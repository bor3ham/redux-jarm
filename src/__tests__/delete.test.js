import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// delete unchanged instance
// delete uncommitted changed instance
// delete committed changed instance (not pending)
// delete committed changed instance (pending)
// delete instance that does not exist
