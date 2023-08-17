import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

describe('[JWT Adapter]', () => {
  it('Should call sign with corrects values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
  })
})
