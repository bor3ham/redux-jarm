function logParseTime(start, end) {
  // console.warn('JSON parse took:', end - start)
}
function attemptToParseJson(response) {
  return new Promise((resolve, reject) => {
    if (response && typeof response.json === 'function') {
      const start = +(new Date())
      response.json().then((parsed) => {
        const end = +(new Date())
        logParseTime(start ,end)
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

function logPopulateDataTime(start, end) {
  // console.warn('populating data took:', end - start)
}
function logPopulateIncludedTime(start, end) {
  // console.warn('populating included took:', end - start)
}
export default function defaultFetch(url, config={}, data={}, populate=true) {
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
          if (populate) {
            if ('data' in response) {
              if ('data' in response.data) {
                const start = +(new Date())
                dispatch(this.populate(response.data.data))
                const end = +(new Date())
                logPopulateDataTime(start, end)
              }
              if ('included' in response.data) {
                const start = +(new Date())
                dispatch(this.populate(response.data.included))
                const end = +(new Date())
                logPopulateIncludedTime(start, end)
              }
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
