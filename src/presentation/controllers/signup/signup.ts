import type { IHttpRequest, IHttpResponse, IController, IAddAccount, IValidation } from './signup-protocols'

import { badRequest, serverError, success } from '../../helpers/http-helper'

export class SignUpController implements IController {
  private readonly addAccount: IAddAccount
  private readonly validation: IValidation

  constructor (addAccount: IAddAccount, validation: IValidation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      return success(account)
    } catch (err) {
      return serverError(err)
    }
  }
}
