import { createJarm } from '..'

function customJarm(settings) {
  return createJarm({
    baseUrl: 'https://example.com/api',
    ...settings,
    schema: {
      Task: {
        url: '/tasks/',
      },
      ...settings.schema,
    },
  })
}
export { customJarm }

const jarm = customJarm({})

export default jarm
