import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'

export function getList (service: TodoService): ITodoServer['list'] {
  return async (call, callback) => {
    try {
      const { page, size } = call.request.toObject()

      const result = await service.list(page, size)

      callback(null, result)
    } catch (err) {
      callback(err, null)
    }
  }
}