# redux-jarm

[![Build Status](https://travis-ci.com/bor3ham/redux-jarm.svg?branch=master)](https://travis-ci.com/bor3ham/redux-jarm)
[![Coverage Status](https://coveralls.io/repos/github/bor3ham/redux-jarm/badge.svg?branch=master)](https://coveralls.io/github/bor3ham/redux-jarm?branch=master)
[![npm version](https://badge.fury.io/js/redux-jarm.svg)](http://badge.fury.io/js/redux-jarm)
![Downloads](http://img.shields.io/npm/dm/redux-jarm.svg?style=flat)

Offline-first redux ORM designed around JSONAPI servers.

## API specification

Check out the full [API Specification](docs/api.md).

Additional resources:

- [Persistence](docs/persist.md)
- [Configuration](docs/config.md)
- [Filter Specification](docs/filter.md)
- [Status Options](docs/status.md)

## Requirements

Jarm requires you to be using `redux` and `redux-thunk` in your middleware.

## Installation

Install the package with yarn / npm:

```
yarn add redux-jarm
# npm install redux-jarm
```

Instantiate a Jarm object with [your config](docs/config.md):

```
import { createJarm } from 'redux-jarm'

const Jarm = createJarm({
  baseUrl: 'https://example.com/api'
  storeKey: 'models',
  schema: {
    User: {
      url: '/users/',
    },
  },
})
```

Register Jarm in your store's reducer:

```
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import Jarm from './jarm.js'

const reducer = combineReducers({
  models: Jarm.reducer,
})
const store = createStore(reducer, applyMiddleware(thunk))
```

Optionally, you can persist your Jarm state [as documented here](docs/persist.md).
