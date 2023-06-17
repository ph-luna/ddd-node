
import type { IEncrypter } from './db-add-account-protocols'

import { DBAddAccount } from './db-add-account'

class EncrypterStub implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise<string>(resolve => {
      resolve('encryptedpassword')
    })
  }
}

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: IEncrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const sut = new DBAddAccount(encrypterStub)

  return { sut, encrypterStub }
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
})
