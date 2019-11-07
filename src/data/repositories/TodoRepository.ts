import { ToDo, PaginatedQueryResult } from '../../../generated/todo_pb'
import { ObjectId, Collection, Db } from 'mongodb'
import { buildTodo } from '../../domain/todo/Todo'
import { SerializedTodo } from '../../domain/todo/SerializedTodo'

type Id = string | ObjectId

export type TodoRepository = {
  create: (todo: ToDo) => Promise<void>
  update: (toto: ToDo) => Promise<void>
  existsById: (id: Id) => Promise<boolean>
  findById: (id: Id) => Promise<ToDo | null>
  save: (todo: ToDo) => Promise<void>
  deleteById: (id: Id) => Promise<void>
  list: (page?: number, size?: number) => Promise<PaginatedQueryResult>
}

export function create (collection: Collection) {
  return async (todo: ToDo) => {
    const { id, ...obj } = todo.toObject()

    await collection.insertOne({ _id: new ObjectId(id), ...obj })
  }
}
export async function update (collection: Collection, todo: ToDo): Promise<void> {
  const { id, ...obj } = todo.toObject()

  const updateSet = { $set: { ...obj } }
  await collection.updateOne({ _id: new ObjectId(id) }, updateSet)
}

async function findOneBy (collection: Collection, query: Record<string, any>): Promise<ToDo | null> {
  const result = await collection.findOne(query)

  if (!result) return null
  
  return buildTodo(result)
}

export async function findOneById (collection: Collection, id: string | ObjectId): Promise<ToDo | null> {
  if (!ObjectId.isValid(id)) return null
  return findOneBy(collection, { _id: new ObjectId(id) })
}

export async function existsBy (collection: Collection, query: Record<string, any>): Promise<boolean> {
  return collection.countDocuments(query)
    .then(count => count > 0)
}

export async function existsById (collection: Collection, id: Id) {
  return existsBy(collection, { _id: new ObjectId(id) })
}

export async function save (collection: Collection, todo: ToDo) {
  const exists = await existsById(collection, todo.getId())

  if (exists) return update(collection, todo)

  return create(collection)(todo)
}

export async function deleteById (collection: Collection, id: Id): Promise<void> {
  if (!ObjectId.isValid(id)) return
  await collection.deleteOne({ _id: new ObjectId(id) })
}

export async function list (collection: Collection, page: number, size: number): Promise<PaginatedQueryResult> {
  const skip = page * size
  const total = await collection.countDocuments()

  const results = await collection.find<SerializedTodo>()
    .skip(skip)
    .limit(size)
    .toArray()
    .then(todos => todos.map(buildTodo))

  const range = new PaginatedQueryResult.PaginatedQueryResultRange()
  range.setFrom(skip)
  range.setTo(skip + results.length)

  const result = new PaginatedQueryResult()
  result.setCount(results.length)
  result.setRange(range)
  result.setTotal(total)
  result.setResultsList(results)

  return result
}

export function getTodoRepository (db: Db): TodoRepository {
  const collection = db.collection('todos')

  return {
    create: create(collection),
    update: (toto: ToDo) => update(collection, toto),
    existsById: (id: Id) => existsById(collection, id),
    findById: (id: Id) => findOneById(collection, id),
    save: (todo: ToDo) => save(collection, todo),
    deleteById: (id: Id) => deleteById(collection, id),
    list: (page = 0, size = 10) => list(collection, page, size)
  }
}