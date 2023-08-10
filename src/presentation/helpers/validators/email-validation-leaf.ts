import type { IEmailValidator } from '../../protocols/email-validator'
import type { IValidation } from './validation'

import { InvalidParamError } from '../../errors'

export class EmailValidationLeaf implements IValidation {
  private readonly fieldName: string
  private readonly emailValidator: IEmailValidator

  constructor (fieldName: string, emailValidator: IEmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) return new InvalidParamError(this.fieldName)
    return null
  }
}
