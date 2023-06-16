import type { IEmailValidator, IAddAccount, AddAccountModel, AccountModel } from '../signup-protocols'

import { SignUpController } from '../signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../../errors'

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements IAddAccount {
  add (account: AddAccountModel): AccountModel {
    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    return fakeAccount
  }
}

interface ISut {
  addAccountStub: IAddAccount
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}

const makeSut = (): ISut => {
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    addAccountStub,
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

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = sut.handle({ body: httpRequestBodySample })

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    sut.handle({ body: httpRequestBodySample })

    expect(addAccountSpy).toBeCalledWith({
      name: httpRequestBodySample.name,
      email: httpRequestBodySample.email,
      password: httpRequestBodySample.password
    })
  })

  it('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = sut.handle({ body: httpRequestBodySample })

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
