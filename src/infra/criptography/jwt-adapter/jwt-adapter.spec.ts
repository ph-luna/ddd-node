import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('mock_secret')
  return { sut }
}

jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return 'mock_access_token'
  }
}))

describe('[JWT Adapter]', () => {
  it('Should call sign with corrects values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toBeCalledWith({ id: 'any_id' }, 'mock_secret')
  })

  it('Should return a token on sign success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('mock_access_token')
  })

  it('Should throw if sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
