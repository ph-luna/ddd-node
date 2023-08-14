import type { IHttpRequest, IHttpResponse } from '../../protocols'

import { ServerError, UnauthorizedError } from '../../errors'

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

export const makeFakeRequest = (args: any): IHttpRequest => ({
  body: args
})

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
