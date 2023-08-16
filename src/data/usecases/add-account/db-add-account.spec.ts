
import type { IEncrypter, AddIAccountModel, IAccountModel, IAddAccountRepository } from './db-add-account-protocols'

import { DBAddAccount } from './db-add-account'

interface IMakeAccountData {
  name: string
  email: string
  password: string
}

const makeFakeAccountData = (): IMakeAccountData => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeFakeAccountAdded = (): IMakeAccountData & { id: string } => ({
  id: 'new_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'encrypted_password'
})

class EncrypterStub implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise<string>(resolve => {
      resolve('encrypted_password')
    })
  }
}

class AddAccountRepositoryStub implements IAddAccountRepository {
  async add (account: AddIAccountModel): Promise<IAccountModel> {
    return await new Promise(resolve => {
      resolve(makeFakeAccountAdded())
    })
  }
}

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: IEncrypter
  IAddAccountRepositoryStub: IAddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const IAddAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DBAddAccount(encrypterStub, IAddAccountRepositoryStub)

  return { sut, encrypterStub, IAddAccountRepositoryStub }
}

describe('[DBAddAccount usecases]', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccountData())

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('Should call DBIAddAccountRepository with correct values', async () => {
    const { sut, IAddAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(IAddAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenCalledWith({ ...makeFakeAccountData(), password: 'encrypted_password' })
  })

  it('Should throw if IAddAccountRepository throws', async () => {
    const { sut, IAddAccountRepositoryStub } = makeSut()
    jest.spyOn(IAddAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())

    expect(account).toEqual(makeFakeAccountAdded())
  })
})
