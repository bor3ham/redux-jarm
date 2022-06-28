import React from 'react'
import { createRoot } from 'react-dom/client'
import { createJarm } from 'redux-jarm'

import { BuildingCreator } from './building-creator.jsx'

console.log('local jarm is', createJarm)

const ReduxJarmDemo = () => {
  return (
    <>
      <p>Redux Jarm Demo</p>
      <BuildingCreator />
    </>
  )
}

const mount = document.querySelector('div.redux-jarm-demo')
if (mount) {
  const root = createRoot(mount)
  root.render(<ReduxJarmDemo />)
}
