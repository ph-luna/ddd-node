import type { Express } from 'express'

import { bodyParser, cors, contentType, bodyParserErrorHandler } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(bodyParserErrorHandler)
  app.use(cors)
  app.use(contentType)
}
