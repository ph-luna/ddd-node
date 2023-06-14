import { SignUpController } from '../signup'
import { MissingParamError } from '../../errors/missing-param-error'

const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('[SignUp Controller]', () => {
  const httpRequestBodySample = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  it('Should return 400 if no name is provided', () => {
    const sut = makeSut()
    const { name, ...remainingValues } = httpRequestBodySample

    const httpResponse = sut.handle({ body: remainingValues })
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const sut = makeSut()
    const { email, ...remainingValues } = httpRequestBodySample

    const httpResponse = sut.handle({ body: remainingValues })
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const sut = makeSut()
    const { password, ...remainingValues } = httpRequestBodySample

    const httpResponse = sut.handle({ body: remainingValues })
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})
