import type { IEmailValidator, IAddAccount, AddAccountModel, AccountModel } from './signup-protocols'

import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { success, badRequest, serverError, makeFakeRequest } from '../../helpers/http-helper'

const accountSample = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements IAddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await new Promise((resolve) => {
      resolve(accountSample)
    })
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
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const { name, ...remainingValues } = accountSample

    const httpResponse = await sut.handle(makeFakeRequest(remainingValues))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const { email, ...remainingValues } = accountSample

    const httpResponse = await sut.handle(makeFakeRequest(remainingValues))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const { password, ...remainingValues } = accountSample

    const httpResponse = await sut.handle(makeFakeRequest(remainingValues))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest(accountSample))

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const emailValidationSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest(accountSample))

    expect(emailValidationSpy).toBeCalledWith(accountSample.email)
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest(accountSample))

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const { id, ...fakeAccount } = accountSample

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest(accountSample))

    expect(addAccountSpy).toBeCalledWith(fakeAccount)
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpResponse = await sut.handle(makeFakeRequest(accountSample))

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest(accountSample))

    expect(httpResponse).toEqual(success(accountSample))
  })
})
