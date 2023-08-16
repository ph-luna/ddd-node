import type { IAccountModel } from '../../usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<IAccountModel | null>
}