import type { IValidation } from '../../../presentation/protocols/validation'
import type { IEmailValidator } from '../../../presentation/protocols/email-validator'

import { ValidationComposite, RequiredFieldValidationLeaf, EmailValidationLeaf } from '../../../presentation/helpers/validators/'
import { makeSignUpValidation } from './signup-validation-factory'

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
