import type { IAccountModel } from '../add-account/db-add-account-protocols'
import type { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

import { DbAuthentication } from './db-authentication'

const accountDummy = {
  id: 'anyId',
  name: 'Any Name',
  email: 'any_email@mail.com',
  password: 'any_password123'
}

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel> {
    return await new Promise(resolve => { resolve(accountDummy) })
  }
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepository)

  return {
    sut,
    loadAccountByEmailRepository
  }
}

describe('[DB Authentication UseCase]', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password123' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
