import type { IValidation } from '../../presentation/helpers/validators/validation'

import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidationLeaf } from '../../presentation/helpers/validators/required-field-validation-leaf'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password']) {
    validations.push(new RequiredFieldValidationLeaf(field))
  }

  return new ValidationComposite(validations)
}
