import type { IValidation } from '../validation'

import { ValidationComposite } from '../validation-composite'

class ValidationStub implements IValidation {
  validate (input: any): Error | null {
    return null
  }
}

interface SutTypes {
  sut: ValidationComposite
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('[Validation Composite]', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ field: 'any value' })
    expect(error).toEqual(new Error())
  })
})
