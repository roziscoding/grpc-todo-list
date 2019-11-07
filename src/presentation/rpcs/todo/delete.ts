import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'
import { makeResult } from '../../makeResult'

export function getDelete (service: TodoService): ITodoServer['delete'] {
  return async (call, callback) => {
    const id = call.request.getId()
    await service.delete(id)
    callback(null, makeResult(true, 204, 'TODO deleted', ''))
  }
}