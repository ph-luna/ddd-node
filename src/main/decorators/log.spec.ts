import type { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface ISut {
  sut: LogControllerDecorator
  controllerStub: IController
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

const makeSut = (): ISut => {
  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return { sut, controllerStub }
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
})
