import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import type { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return null
  }
}
