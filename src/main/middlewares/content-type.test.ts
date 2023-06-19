import request from 'supertest'

import app from '../config/app'

describe('[Content Type Middleware]', () => {
  it('Should return default content type as json', async () => {
    const tempRoute = '/test/content_type'

    app.get(tempRoute, (req, res) => {
      res.send()
    })

    await request(app)
      .get(tempRoute)
      .expect('content-type', /json/)
  })

  it('Should return xml content type when forced', async () => {
    const tempRoute = '/test/content_type_xml'

    app.get(tempRoute, (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get(tempRoute)
      .expect('content-type', /xml/)
  })
})
