import { ObjectId } from 'mongodb'
import { SerializedTodo } from './SerializedTodo'
import { ToDo } from '../../../generated/todo_pb'

export function buildTodo (serialized: SerializedTodo) {
  const todo = new ToDo()

  const id = typeof serialized._id === 'string'
    ? serialized._id
    : serialized._id.toHexString()

  todo.setId(id)
  todo.setTitle(serialized.title)
  todo.setDescription(serialized.description)
  todo.setDone(serialized.done)

  return todo
}

export function createTodo (id: ObjectId, title: string, description: string) {
  return buildTodo({
    _id: id,
    title,
    description,
    done: false
  })
}
