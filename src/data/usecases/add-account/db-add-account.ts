import type { IAccountModel, IAddAccountModel, IAddAccount, IHasher, IAddAccountRepository } from './db-add-account-protocols'

export class DBAddAccount implements IAddAccount {
  private readonly encrypter: IHasher
  private readonly IAddAccountRepository: IAddAccountRepository

  constructor (encrypter: IHasher, IAddAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.IAddAccountRepository = IAddAccountRepository
  }

  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const encryptedPassword = await this.encrypter.hash(accountData.password)

    const account = await this.IAddAccountRepository.add({
      ...accountData,
      password: encryptedPassword
    })

    return account
  }
}
