import type { Request, Response, NextFunction } from 'express'

type BodyParserError = Error & { type: string }

export const bodyParserErrorHandler = (
  error: BodyParserError,
  req: Request,
  res: Response,
  next: NextFunction): void => {
  const bodyParserCommonErrorsTypes = [
    'encoding.unsupported',
    'entity.parse.failed',
    'entity.verify.failed',
    'request.aborted',
    'request.size.invalid',
    'stream.encoding.set',
    'parameters.too.many',
    'charset.unsupported',
    'entity.too.large'
  ]

  if (bodyParserCommonErrorsTypes.includes(error.type)) {
    res.status(422).json(error.message)
    return
  }
  next()
}
