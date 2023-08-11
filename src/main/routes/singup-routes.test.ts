import request from 'supertest'

import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('[SignUp Routes]', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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

  it('Should return an error on missing field name', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: 'ph.luna.vieira@gmail.com',
        password: 'ph2023'
      })
      .expect(400)
  })
})
