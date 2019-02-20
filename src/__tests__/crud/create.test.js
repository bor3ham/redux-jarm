import getStore from '../store.js'
import jarm, { customJarm } from '../jarm.js'

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
  expect(oldState.local[createData.type]).not.toBe(newState.local[createData.type])
  expect(newState.local[createData.type][newId]).toMatchObject(createData)
  expect(newState.new[`${createData.type}-${newId}`]).toBe(true)
  // expect objects to not have been mutated
  expect(oldState.local).not.toBe(newState.local)
  expect(oldState.new).not.toBe(newState.new)
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

test('create a draft that extends a new template', () => {
  const newTemplate = {
    attributes: {
      description: 'Hello there',
    },
  }
  const jarm = customJarm({
    schema: {
      Task: {
        url: '/tasks',
        newTemplate: newTemplate,
      },
    },
  })
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
  expect(oldState.local[createData.type]).not.toBe(newState.local[createData.type])
  expect(newState.local[createData.type][newId]).toMatchObject(createData)
  expect(newState.local[createData.type][newId]).toMatchObject(newTemplate)
  expect(newState.new[`${createData.type}-${newId}`]).toBe(true)
  // expect objects to not have been mutated
  expect(oldState.local).not.toBe(newState.local)
  expect(oldState.new).not.toBe(newState.new)
})

test('create a draft that overrides a new template', () => {
  const newTemplate = {
    attributes: {
      name: 'Default task name',
    },
  }
  const jarm = customJarm({
    schema: {
      Task: {
        url: '/tasks',
        newTemplate: newTemplate,
      },
    },
  })
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
  expect(oldState.local[createData.type]).not.toBe(newState.local[createData.type])
  expect(newState.local[createData.type][newId]).toMatchObject(createData)
  expect(newState.new[`${createData.type}-${newId}`]).toBe(true)
  // expect objects to not have been mutated
  expect(oldState.local).not.toBe(newState.local)
  expect(oldState.new).not.toBe(newState.new)
})
