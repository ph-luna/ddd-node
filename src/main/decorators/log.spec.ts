import type { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import type { ILogErrorRepository } from '../../data/protocols/log-error-repository'

import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers/http-helper'

interface ISut {
  sut: LogControllerDecorator
  controllerStub: IController
  logErrorRepositoryStub: ILogErrorRepository
}

class ControllerStub implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = {
      statusCode: 200,
      body: httpRequest.body
    }

    return await new Promise(resolve => { resolve(httpResponse) })
  }
}

class LogErrorRepositoryStub implements ILogErrorRepository {
  async log (stack: string): Promise<void> {
    await new Promise(resolve => { resolve(null) })
  }
}

const makeSut = (): ISut => {
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('[LogController Decorator]', () => {
  const httpRequestSample: IHttpRequest = {
    body: {
      email: 'any_email@mail.com',
      name: 'Any Name',
      password: 'any_password123'
    }
  }

  it('Should call handle function from parent controller', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(httpRequestSample)

    expect(handleSpy).toBeCalledWith(httpRequestSample)
  })

  it('Should return the same value from parent controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequestSample)

    expect(httpResponse).toEqual({ statusCode: 200, ...httpRequestSample })
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'mock_stack_error'

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(serverError(fakeError)) }))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    await sut.handle(httpRequestSample)

    expect(logSpy).toBeCalledWith(fakeError.stack)
  })
})
