import { instanceKey } from '../utils.js'

function mockOnceDelay(response, settings={}, delay) {
  fetch.mockResponseOnce(() =>  {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          body: JSON.stringify(response),
          init: settings,
        })
      }, delay)
    })
  })
}

// Helper function for cleanly checking if redux-jarm state for a given instance matches all the
// parameters given in stateCheck.
//
// This *would* be nice an expect.extend, but you can't currently re-use the inbuilt expect
// assertions inside a custom matcher so it would actually be unwieldy if it were implemented that
// way.
//
// All the state parameters are mandatory as it seems kinda lazy to only test a few, I'd rather not
// miss any by accident.
function expectInstanceMatches(state, instanceType, instanceId, stateCheck) {
  if (typeof stateCheck === 'undefined') {
    stateCheck = {
      remote: undefined,
      local: undefined,
      new: false,
      committed: false,
      pending: false,
      errors: undefined,
    }
  }
  const key = instanceKey(instanceType, instanceId)

  expect('remote' in stateCheck).toBe(true)
  const stateRemote = state.remote[instanceType] || {}
  if (typeof stateCheck.remote === 'undefined') {
    expect(instanceId in stateRemote).toBe(false)
  } else {
    expect(stateRemote[instanceId]).toMatchObject(stateCheck.remote)
  }

  expect('local' in stateCheck).toBe(true)
  const stateLocal = state.local[instanceType] || {}
  if (typeof stateCheck.local === 'undefined') {
    expect(instanceId in stateLocal).toBe(false)
  } else {
    expect(stateLocal[instanceId]).toMatchObject(stateCheck.local)
  }

  expect('new' in stateCheck).toBe(true)
  expect(typeof stateCheck.new).toBe('boolean')
  if (stateCheck.new) {
    expect(state.new[key]).toBe(true)
  } else {
    expect(key in state.new).toBe(false)
  }

  expect('new' in stateCheck).toBe(true)
  expect(typeof stateCheck.committed).toBe('boolean')
  if (stateCheck.committed) {
    expect(state.committed[key]).toBe(true)
  } else {
    expect(key in state.committed).toBe(false)
  }

  expect('pending' in stateCheck).toBe(true)
  expect(typeof stateCheck.pending).toBe('boolean')
  if (stateCheck.pending) {
    expect(state.pending[key]).toBe(true)
  } else {
    expect(key in state.pending).toBe(false)
  }

  expect('errors' in stateCheck).toBe(true)
  if (typeof stateCheck.errors === 'undefined') {
    expect(key in state.errors).toBe(false)
  } else {
    expect(state.errors[key]).toMatchObject(stateCheck.errors)
  }
}

export { mockOnceDelay, expectInstanceMatches }
