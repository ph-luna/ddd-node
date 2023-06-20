import type { Request, Response } from 'express'

import type { IHttpRequest } from './../../presentation/protocols/http'
import type { IController } from '../../presentation/protocols/controller'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response): Promise<Response> => {
    const httpRequest: IHttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
