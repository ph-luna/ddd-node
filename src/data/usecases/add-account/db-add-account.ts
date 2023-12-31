import type { AccountModel, AddAccountModel, IAddAccount, IEncrypter, AddAccountRepository } from './db-add-account-protocols'

export class DBAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter
  private readonly AddAccountRepository: AddAccountRepository

  constructor (encrypter: IEncrypter, AddAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.AddAccountRepository = AddAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(accountData.password)

    const account = await this.AddAccountRepository.add({
      ...accountData,
      password: encryptedPassword
    })

    return account
  }
}
