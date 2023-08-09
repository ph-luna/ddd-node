import type { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import type { IEmailValidator } from '../signup/signup-protocols'
import type { IAuthentication } from '../../../domain/usecases/authentication'

import { badRequest, serverError, success } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly authentication: IAuthentication

  constructor (emailValidator: IEmailValidator, authentication: IAuthentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.body.email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!httpRequest.body.password) {
        return badRequest(new MissingParamError('password'))
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const { email, password } = httpRequest.body

      await this.authentication.auth(email, password)

      return success({})
    } catch (error) {
      return serverError(error)
    }
  }
}
