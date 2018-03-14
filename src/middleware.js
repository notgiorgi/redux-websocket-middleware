import { isIncomingSocketMessage, isOutgoingSocketMessage } from './utils'

import { ConnectionManager } from './lib'

export default function createWebsocketMiddleware (
  options = {},
  reconnectCallback = null
) {
  return store => {
    const connections = new ConnectionManager(store, options)
    return next => action => {
      if (!isOutgoingSocketMessage(action) || isIncomingSocketMessage(action)) {
        return next(action)
      }

      const endpoint =
        action.meta.socket === true
          ? options.defaultEndpoint
          : action.meta.socket

      if (typeof endpoint === 'string') {
        const connection = connections.has(endpoint)
          ? connections.get(endpoint)
          : connections.add(endpoint, reconnectCallback)

        connection.send(action.payload)
      } else {
        console.warn(
          `
            You provided socket: ${endpoint},
            which is not valid because:
            Either its \`true\` and you forgot to setup
            default endpoint, or its not a string and is some
            invalid value. This action will be ignored:
        `,
          action
        )
      }
    }
  }
}
