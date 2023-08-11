import type { IController, IHttpRequest, IHttpResponse, IAuthentication, IValidation } from './login-protocols'

import { serverError, success, unauthorized, badRequest } from '../../helpers/http-helper'

export class LoginController implements IController {
  private readonly authentication: IAuthentication
  private readonly validation: IValidation

  constructor (validation: IValidation, authentication: IAuthentication) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
