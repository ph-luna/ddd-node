import type { AccountModel, AddAccountModel, IAddAccount, IEncrypter } from './db-add-account-protocols'

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
