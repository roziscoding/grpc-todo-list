import env from 'sugar-env'

export const config = {
  mongodb: {
    uri: env.get('MONGODB_URI', ''),
    dbName: env.get('MONGODB_DBNAME', 'todo-app')
  },
  server: {
    bindAddress: env.get('SERVER_BINDADDRESS', '0.0.0.0'),
    bindPort: env.get('SERVER_BINDPORT', '3000')
  }
}

export type IAppConfig = typeof config
