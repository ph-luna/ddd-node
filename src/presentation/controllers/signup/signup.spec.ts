import type { IAddAccount, AddAccountModel, AccountModel, IValidation } from './signup-protocols'

import { SignUpController } from './signup'
import { MissingParamError, ServerError } from '../../errors'
import { success, badRequest, serverError, makeFakeRequest } from '../../helpers/http/http-helper'

const accountDummy = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

class AddAccountStub implements IAddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await new Promise((resolve) => {
      resolve(accountDummy)
    })
  }
}

class ValidationStub implements IValidation {
  validate (input: any): Error | null {
    return null
  }
}

interface ISut {
  addAccountStub: IAddAccount
  sut: SignUpController
  validationStub: IValidation
}

const makeSut = (): ISut => {
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationStub()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    addAccountStub,
    validationStub,
    sut
  }
}

describe('[SignUp Controller]', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const { id, ...fakeAccount } = accountDummy
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest(accountDummy))
    expect(addAccountSpy).toBeCalledWith(fakeAccount)
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpResponse = await sut.handle(makeFakeRequest(accountDummy))
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest(accountDummy))
    expect(httpResponse).toEqual(success(accountDummy))
  })

  it('Should call with Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest(accountDummy))
    expect(validateSpy).toBeCalledWith(accountDummy)
  })

  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest(accountDummy))
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
