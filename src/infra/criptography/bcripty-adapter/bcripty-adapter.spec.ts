import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcripty-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('encrypted_value') })
  }
}))

const makeSut = (): BcryptAdapter => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return sut
}

describe('[Bcrypt Adapter]', () => {
  it('Should call Bcrypt with correct value', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  it('Should return encrypted value on success', async () => {
    const sut = makeSut()

    const encryptedValue = await sut.encrypt('any_value')

    expect(encryptedValue).toBe('encrypted_value')
  })

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()

    // @ts-expect-error bcrypt hash type error
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
