import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import jarm from './jarm.js'

const store = createStore(
  jarm.reducer,
  applyMiddleware(thunk)
)

export default store
