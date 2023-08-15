import type { IAccountModel } from '../models/account'

export type AddIAccountModel = Pick<IAccountModel, 'name' | 'email' | 'password'>

export interface IAddAccount {
  add: (account: AddIAccountModel) => Promise<IAccountModel>
}
