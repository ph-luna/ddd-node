import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import type { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/authentication'
import type { IHashComparer } from '../../protocols/criptography/hash-compare'

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: IHashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null
    const isPasswordValid = await this.hashComparer.compare(authentication.password, account?.password)
    if (!isPasswordValid) return null
    return ''
  }
}
