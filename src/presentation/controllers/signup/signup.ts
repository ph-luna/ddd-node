import type { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAddAccount, IValidation } from './signup-protocols'

import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/http-helper'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount
  private readonly validation: IValidation

  constructor (emailValidator: IEmailValidator, addAccount: IAddAccount, validation: IValidation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      const requiredFields = ['name', 'email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return success(account)
    } catch (err) {
      return serverError(err)
    }
  }
}
