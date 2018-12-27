import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// todo: discard uncommitted new instance
// todo: discard uncommitted changed instance
// todo: discard committed new instance (not pending)
// todo: discard committed changed instance (not pending)
// todo: discard committed new instance (pending)
// todo: discard committed changed instance (pending)
// todo: discard non existent instance
// todo: discard unchanged instance
