import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('mock_secret')
  return { sut }
}

describe('[JWT Adapter]', () => {
  it('Should call sign with corrects values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toBeCalledWith({ id: 'any_id' }, 'mock_secret')
  })
})
