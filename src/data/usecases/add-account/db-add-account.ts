import type { AccountModel } from '../../../domain/models/account'
import type { AddAccountModel, IAddAccount } from '../../../domain/usecases/add-account'
import type { IEncrypter } from '../../protocols/encrypter'

export class DBAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter

  constructor (encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return await new Promise(resolve => { resolve({ id: '', ...account }) })
  }
}
