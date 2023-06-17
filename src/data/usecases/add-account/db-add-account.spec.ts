
import type { IEncrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'

import { DBAddAccount } from './db-add-account'

class EncrypterStub implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise<string>(resolve => {
      resolve('encrypted_password')
    })
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await new Promise(resolve => {
      const fakeAccount = {
        id: 'new_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'encrypted_password'
      }

      resolve(fakeAccount)
    })
  }
}

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: IEncrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub)

  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('[DBAddAccount usecases]', () => {
  const accountDataSample = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }

  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(accountDataSample)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const promise = sut.add(accountDataSample)

    await expect(promise).rejects.toThrow()
  })

  it('Should call DBAddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(accountDataSample)

    expect(addSpy).toHaveBeenCalledWith({ ...accountDataSample, password: 'encrypted_password' })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const promise = sut.add(accountDataSample)

    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(accountDataSample)

    expect(account).toEqual({ id: 'new_id', name: 'valid_name', email: 'valid_email', password: 'encrypted_password' })
  })
})
