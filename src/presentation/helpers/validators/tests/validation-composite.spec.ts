import type { IValidation } from '../validation'

import { ValidationComposite } from '../validation-composite'

class ValidationStub implements IValidation {
  validate (input: any): Error | null {
    return null
  }
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: ValidationStub[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [new ValidationStub(), new ValidationStub()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

const inputDummy = {
  anyField: 'any value'
}

describe('[Validation Composite]', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate(inputDummy)
    expect(error).toEqual(new Error())
  })

  it('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error('first error'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error('second error'))
    const error = sut.validate(inputDummy)
    expect(error).toEqual(new Error('first error'))
  })

  it('Should return falsy if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate(inputDummy)
    expect(error).toBeFalsy()
  })
})
