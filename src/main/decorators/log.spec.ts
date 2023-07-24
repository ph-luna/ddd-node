import type { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import type { ILogErrorRepository } from '../../data/protocols/log-error-repository'

import { LogControllerDecorator } from './log'
import { serverError, success } from '../../presentation/helpers/http-helper'

interface IMakeFakeAccount {
  name: string
  email: string
  password: string
}

const makeFakeAccount = (): IMakeFakeAccount => ({
  email: 'any_email@mail.com',
  name: 'Any Name',
  password: 'any_password123'
})

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    ...makeFakeAccount()
  }
})

const makeServerError = (): IHttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'mocked_stack_error'

  return serverError(fakeError)
}
class ControllerStub implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return await new Promise(resolve => { resolve(success(httpRequest.body)) })
  }
}

class LogErrorRepositoryStub implements ILogErrorRepository {
  async log (stack: string): Promise<void> {
    await new Promise(resolve => { resolve(null) })
  }
}

interface ISut {
  sut: LogControllerDecorator
  controllerStub: IController
  logErrorRepositoryStub: ILogErrorRepository
}

const makeSut = (): ISut => {
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('[LogController Decorator]', () => {
  it('Should call handle function from parent controller', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toBeCalledWith(makeFakeRequest())
  })

  it('Should return the same value from parent controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(success(makeFakeAccount()))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(makeServerError()) }))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    await sut.handle(makeFakeRequest())

    expect(logSpy).toBeCalledWith('mocked_stack_error')
  })
})
