import type { IEmailValidator, IAuthentication } from './login-protocols'

import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, makeFakeRequest, serverError, success, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'

const loginSample = {
  email: 'any_email@mail.com',
  password: 'anypassword123'
}

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AuthenticationStub implements IAuthentication {
  async auth (email: string, password: string): Promise<string | null> {
    return 'any_token000'
  }
}

interface SutType {
  sut: LoginController
  emailValidatorStub: EmailValidatorStub
  authenticationStub: AuthenticationStub
}

const makeSut = (): SutType => {
  const emailValidatorStub = new EmailValidatorStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return { sut, emailValidatorStub, authenticationStub }
}

describe('[Login Controller]', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const { password } = loginSample

    const httpResponse = await sut.handle(makeFakeRequest({ password }))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const { email } = loginSample

    const httpResponse = await sut.handle(makeFakeRequest({ email }))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest(loginSample))

    expect(isValidSpy).toBeCalledWith(loginSample.email)
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest(loginSample))

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest(loginSample))

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest(loginSample))

    expect(authSpy).toBeCalledWith(loginSample.email, loginSample.password)
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))

    const httpResponse = await sut.handle(makeFakeRequest(loginSample))

    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpResponse = await sut.handle(makeFakeRequest(loginSample))

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest(loginSample))

    expect(httpResponse).toEqual(success({ accessToken: 'any_token000' }))
  })
})
