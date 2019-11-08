import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'
import { wrapUnaryCall } from '../../utils/wrapUnaryCall'

export function getList (service: TodoService): ITodoServer['list'] {
  return wrapUnaryCall(async (call) => {
    const { page, size } = call.request.toObject()

    return service.list(page, size)
  })
}
