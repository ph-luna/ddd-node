import app from './config/app'
import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

async function startServer (): Promise<void> {
  await MongoHelper.connect(env.mongoUrl)

  app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
}

startServer().catch(console.error)
