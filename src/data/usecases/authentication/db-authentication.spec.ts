import type {
  IAccountModel,
  ILoadAccountByEmailRepository,
  IHashComparer,
  IEncrypter,
  IUpdateAccessTokenRepository
} from './db-authentication-protocols'

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

class ILoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel | null> {
    return await new Promise(resolve => {
      resolve(accountDummy)
    })
  }
}

class HashComparerStub implements IHashComparer {
  async compare (value: string, hash: string): Promise<boolean> {
    return true
  }
}

class EncrypterStub implements IEncrypter {
  async encrypt (value: string): Promise<string> {
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
  ILoadAccountByEmailRepository: ILoadAccountByEmailRepositoryStub
  hashComparerStub: HashComparerStub
  encrypterStub: EncrypterStub
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryStub
}

const makeSut = (): SutTypes => {
  const ILoadAccountByEmailRepository = new ILoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  const encrypterStub = new EncrypterStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    ILoadAccountByEmailRepository,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    ILoadAccountByEmailRepository,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('[DB Authentication UseCase]', () => {
  it('Should call ILoadAccountByEmailRepository with correct email', async () => {
    const { sut, ILoadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(ILoadAccountByEmailRepository, 'load')
    await sut.auth(authenticationDummy)
    expect(loadSpy).toHaveBeenCalledWith(authenticationDummy.email)
  })

  it('Should throw if ILoadAccountByEmailRepository throws', async () => {
    const { sut, ILoadAccountByEmailRepository } = makeSut()
    jest.spyOn(ILoadAccountByEmailRepository, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.auth(authenticationDummy)
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if ILoadAccountByEmailRepository returns null', async () => {
    const { sut, ILoadAccountByEmailRepository } = makeSut()
    jest.spyOn(ILoadAccountByEmailRepository, 'load').mockReturnValueOnce(
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

  it('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(authenticationDummy)
    expect(generateSpy).toHaveBeenCalledWith(accountDummy.id)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
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

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.auth(authenticationDummy)
    await expect(promise).rejects.toThrow()
  })
})
