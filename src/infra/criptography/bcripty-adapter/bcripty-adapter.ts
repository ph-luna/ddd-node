import bcrypt from 'bcrypt'

import type { IHasher } from '../../../data/protocols/criptography/hasher'
import type { IHashComparer } from '../../../data/protocols/criptography/hash-compare'

export class BcryptAdapter implements IHasher, IHashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const encryptedValue = await bcrypt.hash(value, this.salt)
    return encryptedValue
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
