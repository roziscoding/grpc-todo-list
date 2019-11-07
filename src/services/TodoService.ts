import { ObjectId } from 'mongodb'
import { createTodo } from '../domain/todo/Todo'
import { TodoNotFoundError } from './errors/TodoNotFoundError'
import { TodoRepository } from '../data/repositories/TodoRepository'
import { ToDo, PaginatedQueryResult } from '../../generated/todo_pb'

export function create (repository: TodoRepository) {
  return async (title: string, description: string) => {
    const todo = createTodo(new ObjectId(), title, description)

    await repository.save(todo)

    return todo
  }
}

export function list (repository: TodoRepository) {
  return async (page?: number, size?: number) => repository.list(page, size || 10)
}

export function toggleTodo (repository: TodoRepository) {
  return async (id: string) => {
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
  create: (title: string, description: string) => Promise<ToDo>
  list: (page?: number, size?: number) => Promise<PaginatedQueryResult>
  findById: (id: string) => Promise<ToDo | null>
  toggleTodo: (id: string) => Promise<ToDo>,
  delete: (id: string) => Promise<void>
}

export function getTodoService (repository: TodoRepository): TodoService {
  return {
    create: create(repository),
    list: list(repository),
    findById: (id: string) => repository.findById(id),
    toggleTodo: toggleTodo(repository),
    delete: (id: string) => repository.deleteById(id)
  }
}