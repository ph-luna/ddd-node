import type { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import type { ILogErrorRepository } from '../../data/protocols/log-error-repository'

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  private readonly logErrorRepository: ILogErrorRepository

  constructor (controller: IController, logErrorRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
