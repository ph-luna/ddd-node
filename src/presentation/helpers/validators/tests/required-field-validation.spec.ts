import { MissingParamError } from '../../../errors'
import { RequiredFieldValidationLeaf } from '../required-field-validation-leaf'

interface SutTypes {
  sut: RequiredFieldValidationLeaf
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidationLeaf('field')
  return {
    sut
  }
}

describe('[Required Field Validation]', () => {
  it('Should returan a missing param error if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ name: 'any name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
