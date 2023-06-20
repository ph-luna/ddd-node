import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository()

  return sut
}

describe('[Mongo Repository - Account]', () => {
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
    const sut = makeSut()

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
