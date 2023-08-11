import type { IValidation } from '../../../presentation/helpers/validators/validation'
import type { IEmailValidator } from '../../../presentation/protocols/email-validator'

import { RequiredFieldValidationLeaf } from '../../../presentation/helpers/validators/required-field-validation-leaf'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation-factory'
import { EmailValidationLeaf } from '../../../presentation/helpers/validators/email-validation-leaf'

jest.mock('../../../presentation/helpers/validators/validation-composite')

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('[SignUp Validation Factory]', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password']) {
      validations.push(new RequiredFieldValidationLeaf(field))
    }
    validations.push(new EmailValidationLeaf('email', new EmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
