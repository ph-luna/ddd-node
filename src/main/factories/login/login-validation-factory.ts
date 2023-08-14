import type { IValidation } from '../../../presentation/protocols/validation'

import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidationLeaf } from '../../../presentation/helpers/validators/required-field-validation-leaf'
import { EmailValidationLeaf } from '../../../presentation/helpers/validators/email-validation-leaf'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidationLeaf(field))
  }
  validations.push(new EmailValidationLeaf('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
