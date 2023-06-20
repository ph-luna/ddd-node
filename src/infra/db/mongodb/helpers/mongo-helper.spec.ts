import { MongoHelper as sut } from './mongo-helper'

describe('[Mongo Helper]', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect to DB if connection closed', async () => {
    let accountCollection = await sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()

    await sut.disconnect()

    accountCollection = await sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()
  })
})
