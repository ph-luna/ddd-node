import type { IValidation } from '../../protocols/validation'

export class ValidationComposite implements IValidation {
  private readonly validationsLeaf: IValidation[]

  constructor (validations: IValidation[]) {
    this.validationsLeaf = validations
  }

  validate (input: any): Error | null {
    for (const validation of this.validationsLeaf) {
      const error = validation.validate(input)
      if (error) return error
    }
    return null
  }
}
