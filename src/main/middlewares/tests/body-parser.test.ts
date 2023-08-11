import request from 'supertest'

import app from '../../config/app'

describe('[Body Parser Middleware]', () => {
  it('Should parse body as json', async () => {
    const testRoute = '/test_body_parser'
    app.post(testRoute, (req, res) => { res.send(req.body) })
    await request(app)
      .post(testRoute)
      .send({ name: 'PH' })
      .expect({ name: 'PH' })
  })

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
