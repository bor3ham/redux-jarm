import createJarm from '..'

const jarm = createJarm({
  baseUrl: 'https://example.com/api',
  schema: {
    Task: {
      url: '/tasks',
    },
  },
})

export default jarm
