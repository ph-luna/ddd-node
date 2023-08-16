import type { IAccountModel } from '../add-account/db-add-account-protocols'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import type { IHashComparer } from '../../protocols/criptography/hash-compare'
import type { ITokenGenerator } from '../../protocols/criptography/token-generator'
import type { IUpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

import { DbAuthentication } from './db-authentication'

const authenticationDummy = {
  email: 'any_email@mail.com',
  password: 'any_password123'
}

const accountDummy = {
  id: 'anyId',
  name: 'Any Name',
  email: 'any_email@mail.com',
  password: 'hashed_password123'
}

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel | null> {
    return await new Promise(resolve => {
      resolve(accountDummy)
    })
  }
}

class HashComparerStub implements IHashComparer {
  async compare (firstValue: string, secondValue: string): Promise<boolean> {
    return true
  }
}

class TokenGeneratorStub implements ITokenGenerator {
  async generate (id: string): Promise<string> {
    return await new Promise(resolve => { resolve('any_access_token') })
  }
}

class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
  async update (accountId: string, accessToken: string): Promise<void> {
    await new Promise<void>(resolve => { resolve() })
  }
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepositoryStub
  hashComparerStub: HashComparerStub
  tokenGeneratorStub: TokenGeneratorStub
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  const tokenGeneratorStub = new TokenGeneratorStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepository,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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
    expect(accessToken).toBeNull()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(authenticationDummy)
    expect(compareSpy).toHaveBeenCalledWith(authenticationDummy.password, accountDummy.password)
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

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => { resolve(false) })
    )
    const accessToken = await sut.auth(authenticationDummy)
    expect(accessToken).toBeNull()
  })

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(authenticationDummy)
    expect(generateSpy).toHaveBeenCalledWith(accountDummy.id)
  })

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.auth(authenticationDummy)
    await expect(promise).rejects.toThrow()
  })

  it('Should return an access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(authenticationDummy)
    expect(accessToken).toBe('any_access_token')
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(authenticationDummy)
    expect(updateSpy).toHaveBeenCalledWith(accountDummy.id, 'any_access_token')
  })
})
