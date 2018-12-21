import getStore from './store.js'
import jarm from './jarm.js'

test('create a draft', () => {
  const store = getStore()
  const oldState = store.getState()
  const createData = {
    type: 'Task',
    attributes: {
      name: 'Mow the lawn',
    },
  }
  const newId = store.dispatch(jarm.create(createData))
  const newState = store.getState()
  expect(oldState.local).not.toBe(newState.local)
  expect(oldState.new).not.toBe(newState.new)
  expect(oldState.local[createData.type]).not.toBe(newState.local[createData.type])
  expect(newState.local[createData.type][newId]).toMatchObject(createData)
  expect(newState.new[newId]).toBe(true)
})

test('create a draft with no type', () => {
  const store = getStore()
  const createData = {
    attributes: {
      name: 'Mow the lawn',
    },
  }
  expect(() => {
    store.dispatch(jarm.create(createData))
  }).toThrow()
})

// create a draft that extends a new template
// create a draft that overrides a new template
