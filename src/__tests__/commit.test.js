import getStore from './store.js'
import jarm from './jarm.js'

test('commit a created instance', () => {
  const store = getStore()
  const createData = {
    type: 'Task',
    attributes: {
      name: 'Mow the lawn',
    },
  }
  const newId = store.dispatch(jarm.create(createData))
  const oldState = store.getState()
  store.dispatch(jarm.commit(createData.type, newId))
  const newState = store.getState()
  // expect(oldState.committed).not.toBe(newState.committed)
})
