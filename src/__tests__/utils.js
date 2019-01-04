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

export { mockOnceDelay }
