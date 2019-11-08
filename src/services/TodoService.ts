import { Writable } from 'stream'
import { ObjectId } from 'mongodb'
import { createTodo } from '../domain/todo/Todo'
import { TodoNotFoundError } from './errors/TodoNotFoundError'
import { TodoRepository } from '../data/repositories/TodoRepository'
import { ToDo, PaginatedQueryResult } from '../../generated/todo_pb'

type CreateFn = (title: string, description: string) => Promise<ToDo>
type ListFn = (page?: number, size?: number) => Promise<PaginatedQueryResult>
type FindByIdFn = (id: string) => Promise<ToDo | null>
type ToggleTodoFn = (id: string) => Promise<ToDo>
type DeleteFn = (id: string) => Promise<void>
type ListStreamFn = (stream: Writable) => void

export function create (repository: TodoRepository): CreateFn {
  return async (title, description) => {
    const todo = createTodo(new ObjectId(), title, description)

    await repository.save(todo)

    return todo
  }
}

export function list (repository: TodoRepository): ListFn {
  return async (page?, size?) => repository.list(page, size || 10)
}

export function toggleTodo (repository: TodoRepository): ToggleTodoFn {
  return async (id) => {
    const todo = await repository.findById(id)

    if (!todo) {
      throw new TodoNotFoundError(id)
    }

    todo.setDone(!todo.getDone())

    await repository.save(todo)

    return todo
  }
}

export type TodoService = {
  create: CreateFn
  list: ListFn
  findById: FindByIdFn
  toggleTodo: ToggleTodoFn
  delete: DeleteFn
  listStream: ListStreamFn
}

export function getTodoService (repository: TodoRepository): TodoService {
  return {
    create: create(repository),
    list: list(repository),
    findById: repository.findById,
    toggleTodo: toggleTodo(repository),
    delete: repository.deleteById,
    listStream: repository.listStream
  }
}
