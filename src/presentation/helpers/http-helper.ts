import type { IHttpResponse } from '../protocols'

import { ServerError } from '../errors'

export const success = (body: any): IHttpResponse => ({
  statusCode: 200,
  body
})

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (err: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(err.stack)
})
