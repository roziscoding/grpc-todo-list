import { PassThrough } from 'stream'
import { buildTodo } from '../../../domain/todo/Todo'
import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'

export function getStreamList (service: TodoService): ITodoServer['streamList'] {
  return async (call) => {
    const stream = new PassThrough()

    service.listStream(stream)

    stream.on('data', (data: string) => {
      const todo = buildTodo(JSON.parse(data))

      call.write(todo)
    })

    stream.on('end', () => {
      console.log('Call ended')
      call.end()
    })

    stream.on('error', (err) => {
      console.error(err)
      call.write(err)
      call.end()
    })
  }
}
