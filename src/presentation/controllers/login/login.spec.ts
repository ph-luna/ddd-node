import type { IEmailValidator } from '../signup/signup-protocols'

import { MissingParamError } from '../../errors'
import { badRequest, makeFakeRequest } from '../../helpers/http-helper'
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

interface SutType {
  sut: LoginController
  emailValidator: EmailValidatorStub
}

const makeSut = (): SutType => {
  const emailValidator = new EmailValidatorStub()
  const sut = new LoginController(emailValidator)

  return { sut, emailValidator }
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
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(makeFakeRequest(loginSample))

    expect(isValidSpy).toBeCalledWith(loginSample.email)
  })
})
