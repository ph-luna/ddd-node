import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('[Mongo Repository - Account]', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toEqual('valid_name')
    expect(account.email).toEqual('valid_email@mail.com')
    expect(account.password).toEqual('valid_password')
  })
})
