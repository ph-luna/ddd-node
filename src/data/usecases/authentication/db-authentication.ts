import type {
  ILoadAccountByEmailRepository,
  IAuthentication,
  IAuthenticationModel,
  IHashComparer,
  IEncrypter,
  IUpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements IAuthentication {
  private readonly ILoadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer
  private readonly encrypter: IEncrypter
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

  constructor (
    ILoadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
    encrypter: IEncrypter,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.ILoadAccountByEmailRepository = ILoadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.ILoadAccountByEmailRepository.load(authentication.email)
    if (!account) return null
    const isPasswordValid = await this.hashComparer.compare(authentication.password, account?.password)
    if (!isPasswordValid) return null
    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
