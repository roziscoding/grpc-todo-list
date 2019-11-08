import { wrapUnaryCall } from '../../utils/wrapUnaryCall'
import { TodoService } from '../../../services/TodoService'
import { OperationResult } from '../../../../generated/todo_pb'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'

export function getCreate (service: TodoService): ITodoServer[ 'create' ] {
  return wrapUnaryCall(async call => {
    const { description, title } = call.request.toObject()

    const todo = await service.create(title, description)

    const result = new OperationResult()
    result.setOk(true)
    result.setStatus(201)
    result.setMessage('TODO created successfully')
    result.setInfo(todo.getId())

    return result
  })
}
