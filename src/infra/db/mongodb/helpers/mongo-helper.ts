import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  dbClient: null as MongoClient | null,

  async connect (connectionUrl: string) {
    this.dbClient = await MongoClient.connect(connectionUrl)
  },

  async disconnect () {
    await this.dbClient.close()
  },

  getCollection (collectionName: string): Collection {
    return this.dbClient.db().collection(collectionName)
  },

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection

    return { id: _id, ...collectionWithoutId }
  }
}
