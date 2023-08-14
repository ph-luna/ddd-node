import type { IValidation } from '../../../presentation/protocols/validation'

import { ValidationComposite, RequiredFieldValidationLeaf, EmailValidationLeaf } from '../../../presentation/helpers/validators/'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidationLeaf(field))
  }
  validations.push(new EmailValidationLeaf('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
