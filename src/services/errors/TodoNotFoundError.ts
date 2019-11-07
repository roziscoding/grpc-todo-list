export class TodoNotFoundError extends Error {
  constructor (id: string) {
    super(`A todo with id "${id}" was not found.`)
  }
}