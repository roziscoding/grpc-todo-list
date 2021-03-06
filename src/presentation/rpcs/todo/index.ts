import { getList } from './list'
import { getDelete } from './delete'
import { getCreate } from './create'
import { getToggleDone } from './toggle-done'
import { getStreamList } from './stream-list'
import { TodoService } from '../../../services/TodoService'
import { ITodoServer } from '../../../../generated/todo_grpc_pb'

export function factory (service: TodoService): ITodoServer {
  return {
    create: getCreate(service),
    delete: getDelete(service),
    list: getList(service),
    toggleDone: getToggleDone(service),
    streamList: getStreamList(service)
  }
}

export default { factory }
