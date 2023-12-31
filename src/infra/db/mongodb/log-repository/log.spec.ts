import type { Collection } from 'mongodb'

import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const makeSut = (): LogMongoRepository => {
  const sut = new LogMongoRepository()

  return sut
}

describe('[Log Mongo Repository]', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')

    await errorCollection.deleteMany({})
  })

  it('Should save an error log', async () => {
    const sut = makeSut()
    await sut.logError('any error 404')

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
