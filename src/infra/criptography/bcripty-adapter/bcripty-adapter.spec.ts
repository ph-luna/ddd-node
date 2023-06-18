import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcripty-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('encrypted_value') })
  }
}))

describe('[Bcrypt Adapter]', () => {
  it('Should call Bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return encrypted value on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const encryptedValue = await sut.encrypt('any_value')

    expect(encryptedValue).toBe('encrypted_value')
  })
})
