import type { IHttpRequest, IHttpResponse, IController } from '../protocols'
import type { IEmailValidator } from '../protocols/email-validator'
import type { IAddAccount } from '../../domain/usecases/add-account'

import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError, success } from '../helpers/http-helper'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount

  constructor (emailValidator: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
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

      this.addAccount.add({ name, email, password })

      return success()
    } catch (err) {
      return serverError()
    }
  }
}
