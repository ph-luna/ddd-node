import type { IAccountModel, AddIAccountModel, IAddAccount, IEncrypter, IAddAccountRepository } from './db-add-account-protocols'

export class DBAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter
  private readonly IAddAccountRepository: IAddAccountRepository

  constructor (encrypter: IEncrypter, IAddAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.IAddAccountRepository = IAddAccountRepository
  }

  async add (accountData: AddIAccountModel): Promise<IAccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(accountData.password)

    const account = await this.IAddAccountRepository.add({
      ...accountData,
      password: encryptedPassword
    })

    return account
  }
}
