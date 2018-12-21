import getStore from './store.js'
import jarm from './jarm.js'

test('placeholder', () => {
  const store = getStore()
})

// retree nothing

// retree direct with changes
// retree set with changes

// retree direct with changes -> direct with changes
// retree direct with changes -> set with changes
// retree set with changes -> direct with changes
// retree set with changes -> set with changes

// retree direct without changes -> direct with changes
// retree direct without changes -> set with changes
// retree set without changes -> direct with changes
// retree set without changes -> set with changes

// retree direct with changes -> direct without changes
// retree direct with changes -> set without changes
// retree set with changes -> direct without changes
// retree set with changes -> set without changes

// retree direct without changes -> direct without changes
// retree direct without changes -> set without changes
// retree set without changes -> direct without changes
// retree set without changes -> set without changes

// retree recurse to top level
// retree direct -> set recurse
// retree direct -> direct recurse
// retree set -> direct recurse
// retree set -> set recurse
