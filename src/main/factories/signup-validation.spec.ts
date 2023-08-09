import type { IValidation } from '../../presentation/helpers/validators/validation'

import { RequiredFieldValidationLeaf } from '../../presentation/helpers/validators/required-field-validation-leaf'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('[SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password']) {
      validations.push(new RequiredFieldValidationLeaf(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
