import type { IAddAccountModel } from '../../../domain/usecases/add-account'
import type { IAccountModel } from '../../../domain/models/account'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
