import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'
import { makeResult } from '../../makeResult'
import { wrapUnaryCall } from '../../utils/wrapUnaryCall'

export function getDelete (service: TodoService): ITodoServer['delete'] {
  return wrapUnaryCall(async (call) => {
    const id = call.request.getId()
    await service.delete(id)
    return makeResult(true, 204, 'TODO deleted')
  })
}
