import type { IAccountModel } from '../add-account/db-add-account-protocols'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import type { IHashComparer } from '../../protocols/criptography/hash-compare'

import { DbAuthentication } from './db-authentication'

const authenticationDummy = {
  email: 'any_email@mail.com',
  password: 'any_password123'
}

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel | null> {
    return await new Promise(resolve => {
      resolve({
        id: 'anyId',
        name: 'Any Name',
        email: 'any_email@mail.com',
        password: 'hashed_password123'
      })
    })
  }
}

class HashComparerStub implements IHashComparer {
  async compare (firstValue: string, secondValue: string): Promise<boolean> {
    return true
  }
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepositoryStub
  hashComparerStub: HashComparerStub
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  const sut = new DbAuthentication(loadAccountByEmailRepository, hashComparerStub)

  return {
    sut,
    loadAccountByEmailRepository,
    hashComparerStub
  }
}

describe('[DB Authentication UseCase]', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(authenticationDummy)
    expect(loadSpy).toHaveBeenCalledWith(authenticationDummy.email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.auth(authenticationDummy)
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(
      new Promise((resolve) => { resolve(null) })
    )
    const accessToken = await sut.auth(authenticationDummy)
    expect(accessToken).toBe(null)
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(authenticationDummy)
    expect(compareSpy).toHaveBeenCalledWith(authenticationDummy.password, 'hashed_password123')
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.auth(authenticationDummy)
    await expect(promise).rejects.toThrow()
  })
})
