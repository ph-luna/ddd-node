import type { IHttpRequest, IHttpResponse, IController } from '../protocols'
import type { IEmailValidator } from '../protocols/email-validator'

import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError, success } from '../helpers/http-helper'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return success()
    } catch (err) {
      return serverError()
    }
  }
}
