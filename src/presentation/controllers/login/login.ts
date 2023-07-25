import type { IController, IHttpRequest, IHttpResponse } from '../../protocols'

import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return badRequest(new MissingParamError('email'))
  }
}
