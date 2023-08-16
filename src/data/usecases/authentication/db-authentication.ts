import type {
  LoadAccountByEmailRepository,
  IAuthentication,
  IAuthenticationModel,
  IHashComparer,
  ITokenGenerator,
  IUpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer
  private readonly tokenGenerator: ITokenGenerator
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: IHashComparer,
    tokenGenerator: ITokenGenerator,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null
    const isPasswordValid = await this.hashComparer.compare(authentication.password, account?.password)
    if (!isPasswordValid) return null
    const accessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
