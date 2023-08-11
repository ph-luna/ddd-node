import type { IEmailValidator } from '../../../protocols/email-validator'

import { EmailValidationLeaf } from '../email-validation-leaf'
import { InvalidParamError } from '../../../errors'

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

interface SutTypes {
  sut: EmailValidationLeaf
  emailValidatorStub: EmailValidatorStub
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidationLeaf('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const inputDummy = {
  email: 'any_email@mail.com'
}

describe('[Email Validation Leaf]', () => {
  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate(inputDummy)
    expect(isValidSpy).toBeCalledWith(inputDummy.email)
  })

  it('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  it('Should return InvalidParamError if EmailValidator returns invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(inputDummy)
    expect(error).toEqual(new InvalidParamError('email'))
  })
})
