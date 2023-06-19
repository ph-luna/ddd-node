import request from 'supertest'

import app from '../config/app'

describe('[SignUp Routes]', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'PH',
        email: 'ph.luna.vieira@gmail.com',
        password: 'ph2023'
      })
      .expect(200)
  })
})
