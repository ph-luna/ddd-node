import type { AddIAccountModel } from '../../domain/usecases/add-account'
import type { IAccountModel } from '../../domain/models/account'

export interface AddAccountRepository {
  add: (accountData: AddIAccountModel) => Promise<IAccountModel>
}
