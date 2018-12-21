import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// save a commited created instance
// save a commited created instance with no schema url
// save a commited changed instance
// save a draft created instance
// save a draft changed instance
// save a non existent instance

// save created resulting in bad request
// save created resulting in server error
// save created resulting in complete transport error, then retry successfully
// save created resulting in perceived transport error, then retry and handle already exists
// save created resulting in perceived transport error, then discover instance through fetch

// save changed resulting in bad request
// save changed resulting in server error
// save changed resulting in transport error, then retry successfully
