
import type { IEncrypter } from '../../protocols/encrypter'

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
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
