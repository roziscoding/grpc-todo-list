import { Writable } from 'stream'
import { ObjectId, Collection, Db } from 'mongodb'
import { buildTodo } from '../../domain/todo/Todo'
import { SerializedTodo } from '../../domain/todo/SerializedTodo'
import { ToDo, PaginatedQueryResult } from '../../../generated/todo_pb'

type Id = string | ObjectId

type CreateFn = (todo: ToDo) => Promise<void>
type UpdateFn = (toto: ToDo) => Promise<void>
type ExistsByIdFn = (id: Id) => Promise<boolean>
type FindByIdFn = (id: Id) => Promise<ToDo | null>
type SaveFn = (todo: ToDo) => Promise<void>
type DeleteByIdFn = (id: Id) => Promise<void>
type ListFn = (page?: number, size?: number) => Promise<PaginatedQueryResult>
type ListStreamFn = (stream: Writable) => void

export type TodoRepository = {
  create: CreateFn
  update: UpdateFn
  existsById: ExistsByIdFn
  findById: FindByIdFn
  save: SaveFn
  deleteById: DeleteByIdFn
  list: ListFn
  listStream: ListStreamFn
}

export function create (collection: Collection): CreateFn {
  return async (todo) => {
    const { id, ...obj } = todo.toObject()

    await collection.insertOne({ _id: new ObjectId(id), ...obj })
  }
}

export function update (collection: Collection): UpdateFn {
  return async (todo) => {
    const { id, ...obj } = todo.toObject()

    const updateSet = { $set: { ...obj } }
    await collection.updateOne({ _id: new ObjectId(id) }, updateSet)
  }
}

async function findOneBy (collection: Collection, query: Record<string, any>): Promise<ToDo | null> {
  const result = await collection.findOne(query)

  if (!result) return null

  return buildTodo(result)
}

export function findOneById (collection: Collection): FindByIdFn {
  return async (id) => {
    if (!ObjectId.isValid(id)) return null
    return findOneBy(collection, { _id: new ObjectId(id) })
  }
}

export async function existsBy (collection: Collection, query: Record<string, any>): Promise<boolean> {
  return collection.countDocuments(query)
    .then(count => count > 0)
}

export function existsById (collection: Collection): ExistsByIdFn {
  return async (id) => {
    return existsBy(collection, { _id: new ObjectId(id) })
  }
}

export function save (collection: Collection): SaveFn {
  return async (todo) => {
    const exists = await existsById(collection)(todo.getId())

    if (exists) return update(collection)(todo)

    return create(collection)(todo)
  }
}

export function deleteById (collection: Collection): DeleteByIdFn {
  return async (id) => {
    if (!ObjectId.isValid(id)) return
    await collection.deleteOne({ _id: new ObjectId(id) })
  }
}

export function list (collection: Collection): ListFn {
  return async (page = 0, size = 10) => {
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
}

export function listStram (collection: Collection): ListStreamFn {
  return async (stream: Writable) => {
    const cursor = collection.find<SerializedTodo>()
      .stream({ transform: JSON.stringify })

    cursor.on('data', todo => stream.write(todo))
    cursor.on('end', () => {
      stream.end()
      cursor.close()
    })
  }
}

export function getTodoRepository (db: Db): TodoRepository {
  const collection = db.collection('todos')

  return {
    create: create(collection),
    update: update(collection),
    existsById: existsById(collection),
    findById: findOneById(collection),
    save: save(collection),
    deleteById: deleteById(collection),
    list: list(collection),
    listStream: listStram(collection)
  }
}
