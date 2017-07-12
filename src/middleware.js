import {
  isSocketAction,
  isIncomingMessage
} from './utils'

import { ConnectionManager } from './lib'

export default function createWebsocketMiddleware (options = {}) {
  return store => {
    const connections = new ConnectionManager(store, options)
    return next => action => {
      if (!isSocketAction(action) || isIncomingMessage(action)) {
        return next(action)
      }

      const endpoint = action.meta.socket

      const connection = connections.has(endpoint)
        ? connections.get(endpoint)
        : connections.add(endpoint)

      if (connection) {
        connection.send(action.payload)
      } else {
        console.warn(`
            You haven't set up default endpoint
            Or the endpoint you're trying to use
            Is not connected: ${endpoint}
          `)
      }
    }
  }
}
