import type { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import type { AddIAccountModel } from '../../../../domain/usecases/add-account'
import type { IAccountModel } from '../../../../domain/models/account'

import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddIAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(result.insertedId)

    return MongoHelper.map(account)
  }
}
