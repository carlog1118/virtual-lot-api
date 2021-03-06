const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing {ok: true}', () => {
    return supertest(app)
      .get('/')
      .expect(200, {ok: true})
  })
})