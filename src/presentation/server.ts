import app from './app'
import grpc from 'grpc'
import { IAppConfig } from '../app.config'

export async function start(config: IAppConfig) {
  const server = new grpc.Server()
  await app.factory(config, server)
  const bindAddress = `${config.server.bindAddress}:${config.server.bindPort}`

  server.bind(bindAddress, grpc.ServerCredentials.createInsecure())

  server.start()
  console.log(`Server listening on ${bindAddress}`)
  return server
}

export default { start }