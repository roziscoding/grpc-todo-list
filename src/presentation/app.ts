import grpc from 'grpc'
import rpcs from './rpcs'
import { IAppConfig } from '../app.config'
import * as defs from '../../generated/todo_grpc_pb'
import { MongoClient } from 'mongodb'
import { getTodoService } from '../services/TodoService'
import { getTodoRepository } from '../data/repositories/TodoRepository'

export async function factory (config: IAppConfig, server: grpc.Server) {
  const db = await MongoClient.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(connection => {
      return connection.db(config.mongodb.dbName)
    })

  const todoRepository = getTodoRepository(db)
  const todoService = getTodoService(todoRepository)

  server.addService<defs.ITodoServer>(defs.TodoService, rpcs.todo.factory(todoService))
}

export default { factory }