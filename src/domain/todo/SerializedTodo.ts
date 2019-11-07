import { ObjectId } from 'mongodb'

export type SerializedTodo = {
  _id: ObjectId,
  title: string,
  description: string,
  done: boolean
}