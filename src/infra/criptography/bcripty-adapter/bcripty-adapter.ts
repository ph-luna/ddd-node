import bcrypt from 'bcrypt'

import type { IHasher } from '../../../data/protocols/criptography/hasher'

export class BcryptAdapter implements IHasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const encryptedValue = await bcrypt.hash(value, this.salt)
    return encryptedValue
  }
}
