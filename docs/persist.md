# Persistence

Jarm comes with its own persist config. To enable it, simply call persist and reference it:

```
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import Jarm from './jarm.js'

const reducer = combineReducers({
  models: persistReducer(Jarm.getPersistConfig(storage), Jarm.reducer),
})
const store = createStore(reducer, applyMiddleware(thunk))
```
