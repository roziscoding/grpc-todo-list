import { OperationResult } from '../../generated/todo_pb'

export function makeResult (ok: boolean, status: number, message: string, info: string) {
  const result = new OperationResult()
  result.setOk(ok)
  result.setStatus(status)
  result.setMessage(message)
  result.setInfo(info)
  return result
}