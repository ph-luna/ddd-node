import type { AccountModel } from '../models/account'

export type AddAccountModel = Pick<AccountModel, 'name' | 'email' | 'password'>

export interface IAddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
