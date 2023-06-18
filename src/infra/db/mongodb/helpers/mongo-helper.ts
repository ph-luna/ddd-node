import { MongoClient } from 'mongodb'

export const MongoHelper = {
  dbClient: MongoClient,

  async connect (connectionUrl: string) {
    this.dbClient = await MongoClient.connect(connectionUrl)
  },

  async disconnect () {
    await this.dbClient.close()
  }
}
