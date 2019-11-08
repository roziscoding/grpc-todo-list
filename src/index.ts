import grpc from 'grpc'
import { config } from './app.config'
import server from './presentation/server'

let serverInstance: grpc.Server = null as any

server.start(config)
  .then(srv => {
    serverInstance = srv
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

process.on('SIGINT', () => {
  if (!serverInstance) process.exit(0)
  console.log('Received SIGINT. Shutting server down')

  serverInstance.tryShutdown(() => {
    console.log('Server stopped. Exiting now.')
    process.exit(0)
  })
})
