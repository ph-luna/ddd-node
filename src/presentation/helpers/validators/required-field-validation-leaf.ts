import { MissingParamError } from '../../errors'
import type { IValidation } from './validation'

export class RequiredFieldValidationLeaf implements IValidation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
