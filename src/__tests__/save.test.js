import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// todo: save a commited created instance
// todo: save a commited created instance with no schema url
// todo: save a commited changed instance
// todo: save a draft created instance
// todo: save a draft changed instance
// todo: save a non existent instance

// todo: save created resulting in bad request
// todo: save created resulting in server error
// todo: save created resulting in complete transport error, then retry successfully
// todo: save created resulting in perceived transport error, then retry and handle already exists
// todo: save created resulting in perceived transport error, then discover instance through fetch

// todo: save changed resulting in bad request
// todo: save changed resulting in server error
// todo: save changed resulting in transport error, then retry successfully

// todo: save a deletion
// todo: save a deletion where instance has other relations in store
// todo: save a deletion resulting in bad request
// todo: save a deletion resulting in server error
