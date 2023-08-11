import request from 'supertest'

import app from '../../config/app'

describe('[Body Parser Error Handler Middleware]', () => {
  it('Should catch a invalid JSON and return an error', async () => {
    const testRoute = '/test_body_parser_error_handler'
    app.post(testRoute, () => {})
    await request(app)
      .post(testRoute)
      .send('{"invalidjson"}')
      .type('json')
      .expect(422)
  })
})
