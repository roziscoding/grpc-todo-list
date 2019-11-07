import { TodoService } from '../../../services/TodoService'
import { OperationResult } from '../../../../generated/todo_pb'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'

export function getCreate (service: TodoService): ITodoServer['create'] {
  return async (call, callback) => {
    try {
      const { description, title } = call.request.toObject()

      const todo = await service.create(title, description)

      const result = new OperationResult()
      result.setOk(true)
      result.setStatus(201)
      result.setMessage('TODO created successfully')
      result.setInfo(todo.getId())

      callback(null, result)
    } catch (err) {
      callback(err, null)
    }
  }
}