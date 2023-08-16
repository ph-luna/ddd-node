import type { IAccountModel } from '../models/account'

export type IAddAccountModel = Pick<IAccountModel, 'name' | 'email' | 'password'>

export interface IAddAccount {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
