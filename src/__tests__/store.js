import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import jarm from './jarm.js'

function getStore() {
  return createStore(
    jarm.reducer,
    applyMiddleware(thunk)
  )
}

export default getStore
