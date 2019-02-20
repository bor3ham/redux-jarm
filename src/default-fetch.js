function attemptToParseJson(response) {
  return new Promise((resolve, reject) => {
    if (response && typeof response.json === 'function') {
      response.json().then((parsed) => {
        resolve({
          ...response,
          data: parsed,
          status: response.status,
        })
      }).catch((parseError) => {
        resolve({
          ...response,
          data: {},
          status: response.status,
        })
      })
    }
    else {
      resolve(response)
    }
  })
}

export default function defaultFetch(url, config={}, data={}) {
  return (dispatch, getState) => {
    if (!this.baseUrl) {
      throw 'No base url defined'
    }
    return new Promise((resolve, reject) => {
      const filledConfig = {
        ...config,
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          ...config.headers,
        },
      }
      const method = (filledConfig.method || 'GET').toUpperCase()
      if (method !== 'GET') {
        filledConfig.body = JSON.stringify(data)
      }
      fetch(url, filledConfig).then(attemptToParseJson).then((response) => {
        const errorResponse = (response.status >= 400 && response.status < 600)
        if (!errorResponse) {
          if ('data' in response) {
            if ('data' in response.data) {
              dispatch(this.populate(response.data.data))
            }
            if ('included' in response.data) {
              dispatch(this.populate(response.data.included))
            }
          }
        }
        if (errorResponse) {
          reject(response)
        }
        else {
          resolve(response)
        }
      }).catch((errorResponse) => {
        attemptToParseJson(errorResponse).then((parsedError) => {
          reject(parsedError)
        })
      })
    })
  }
}
