import { makeResult } from '../../makeResult'
import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'

export function getToggleDone (service: TodoService): ITodoServer['toggleDone'] {
  return async (call, callback) => {
    try {
      const todo = await service.toggleTodo(call.request.getId())
      const result = makeResult(
        true,
        200,
        `TODO set to ${todo.getDone() ? 'done' : 'not done'}`,
        `${todo.getDone()}`
      )

      callback(null, result)
    } catch (err) {
      callback(err, null)
    }
  }
}