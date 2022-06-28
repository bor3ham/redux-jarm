import React, { useState, useCallback } from 'react'
import { Text, Button } from 'mireco/inputs'

function BuildingCreator() {
  const [name, setName] = useState('')
  const handleNameChange = useCallback((newValue) => {
    setName(newValue)
  }, [setName])
  const handleFormSubmit = useCallback((event) => {
    event.preventDefault()
    console.log('creating building with name', name)
  }, [name])
  const valid = name.trim().length > 0
  return (
    <form onSubmit={handleFormSubmit}>
      <Text
        value={name}
        onChange={handleNameChange}
        placeholder="New Building Name"
      />
      {' '}
      <Button type="submit" disabled={!valid}>Create</Button>
    </form>
  )
}

export { BuildingCreator }
