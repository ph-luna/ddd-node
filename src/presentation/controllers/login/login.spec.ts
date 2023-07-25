import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

const makeFakeLogin = (): { email: string, password: string } => ({
  email: 'any_email@mail.com',
  password: 'anypassword123'
})

interface SutType {
  sut: LoginController
}

const makeSut = (): SutType => {
  const sut = new LoginController()

  return { sut }
}

describe('[Login Controller]', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const { email, ...fakeLogin } = makeFakeLogin()

    const httpResponse = await sut.handle({ body: fakeLogin })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const { password, ...fakeLogin } = makeFakeLogin()

    const httpResponse = await sut.handle({ body: fakeLogin })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
