import type { IValidation } from '../../../presentation/protocols/validation'
import type { IEmailValidator } from '../../../presentation/protocols/email-validator'

import { makeLoginValidation } from './login-validation-factory'
import { ValidationComposite, RequiredFieldValidationLeaf, EmailValidationLeaf } from '../../../presentation/helpers/validators/'

jest.mock('../../../presentation/helpers/validators/validation-composite')

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('[Login Validation Factory]', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidationLeaf(field))
    }
    validations.push(new EmailValidationLeaf('email', new EmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
