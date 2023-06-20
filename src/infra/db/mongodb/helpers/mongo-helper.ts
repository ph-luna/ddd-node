import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  dbClient: null as MongoClient | null,
  connectionUrl: null as string | null,

  async connect (connectionUrl: string) {
    this.dbClient = await MongoClient.connect(connectionUrl)
    this.connectionUrl = connectionUrl
  },

  async disconnect () {
    await this.dbClient.close()
    this.dbClient = null
  },

  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.dbClient) {
      await this.connect(this.connectionUrl)
    }

    return this.dbClient.db().collection(collectionName)
  },

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection

    return { id: _id, ...collectionWithoutId }
  }
}
