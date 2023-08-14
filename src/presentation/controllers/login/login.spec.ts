import type { IAuthentication, IAuthenticationModel, IValidation } from './login-protocols'

import { badRequest, makeFakeRequest, serverError, success, unauthorized } from '../../helpers/http/http-helper'
import { LoginController } from './login'

const loginDummy = {
  email: 'any_email@mail.com',
  password: 'anypassword123'
}

class AuthenticationStub implements IAuthentication {
  async auth (auth: IAuthenticationModel): Promise<string | null> {
    return 'any_token000'
  }
}

class ValidationStub implements IValidation {
  validate (input: any): Error | null {
    return null
  }
}

interface SutType {
  sut: LoginController
  authenticationStub: AuthenticationStub
  validationStub: ValidationStub
}

const makeSut = (): SutType => {
  const authenticationStub = new AuthenticationStub()
  const validationStub = new ValidationStub()
  const sut = new LoginController(validationStub, authenticationStub)
  return { sut, authenticationStub, validationStub }
}

describe('[Login Controller]', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest(loginDummy))
    expect(authSpy).toBeCalledWith(loginDummy)
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))
    const httpResponse = await sut.handle(makeFakeRequest(loginDummy))
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpResponse = await sut.handle(makeFakeRequest(loginDummy))
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest(loginDummy))
    expect(httpResponse).toEqual(success({ accessToken: 'any_token000' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest(loginDummy))
    expect(validateSpy).toBeCalledWith(loginDummy)
  })

  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest(loginDummy))
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
