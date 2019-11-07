import { ObjectId } from 'mongodb'
import { SerializedTodo } from './SerializedTodo'
import { ToDo } from '../../../generated/todo_pb'

export function buildTodo (serialized: SerializedTodo) {
  const todo = new ToDo()
  todo.setId(serialized._id.toHexString())
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