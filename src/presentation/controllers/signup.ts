import type { IHttpRequest, IHttpResponse } from '../protocols/http'
import type { IController } from '../protocols/controller'
import type { IEmailValidator } from '../protocols/email-validator'

import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
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

    return {
      statusCode: 200,
      body: {}
    }
  }
}
