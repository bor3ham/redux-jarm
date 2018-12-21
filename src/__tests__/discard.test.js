import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// discard uncommitted new instance
// discard uncommitted changed instance
// discard committed new instance (not pending)
// discard committed changed instance (not pending)
// discard committed new instance (pending)
// discard committed changed instance (pending)
// discard non existent instance
// discard unchanged instance
