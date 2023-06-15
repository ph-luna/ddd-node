import type { IEmailValidator } from '../../protocols'

import { SignUpController } from '../signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'

interface ISut {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}
class EmailValidatorStub implements IEmailValidator {
  isValid (_: string): boolean {
    return true
  }
}

const makeSut = (): ISut => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    emailValidatorStub,
    sut
  }
}

describe('[SignUp Controller]', () => {
  const httpRequestBodySample = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  it('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const { name, ...remainingValues } = httpRequestBodySample

    const httpResponse = sut.handle({ body: remainingValues })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const { email, ...remainingValues } = httpRequestBodySample

    const httpResponse = sut.handle({ body: remainingValues })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const { password, ...remainingValues } = httpRequestBodySample

    const httpResponse = sut.handle({ body: remainingValues })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = sut.handle({ body: httpRequestBodySample })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const emailValidationSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.handle({ body: httpRequestBodySample })

    expect(emailValidationSpy).toBeCalledWith(httpRequestBodySample.email)
  })

  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })

    const httpResponse = sut.handle({ body: httpRequestBodySample })

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
