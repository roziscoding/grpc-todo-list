import { ServerUnaryCall, handleUnaryCall } from 'grpc'

type PromiseOrValue<Value> = Value | Promise<Value>
type UnaryCallHandlerFn<TReq, TRes> = (call: ServerUnaryCall<TReq>) => PromiseOrValue<TRes>

export function wrapUnaryCall<TReq, TRes> (
  handlerFn: UnaryCallHandlerFn<TReq, TRes>
): handleUnaryCall<TReq, TRes> {
  return async (call, callback) => {
    try {
      const response = await handlerFn(call)
      callback(null, response)
    } catch (err) {
      callback(err, null)
    }
  }
}
