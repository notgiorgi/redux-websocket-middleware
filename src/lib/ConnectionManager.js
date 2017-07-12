import {
  createConnectionAction,
  createDisonnectionAction,
  createErrorAction,
  createMessageAction
} from '../actions'

import { MessageQueue, Connection } from './'

export default class ConnectionManager {
  constructor (store, options = {}) {
    this.store = store
    this.options = options
    this.storage = {}

    if (this.options.defaultEndpoint) {
      this.add(this.options.defaultEndpoint)
    }
  }

  add (endpoint) {
    const connection = new Connection(
      endpoint,
      new MessageQueue(),
      this.options.codec
    ).subscribe({
      onOpen: () => {
        this.store.dispatch(createConnectionAction(endpoint))
      },
      onMessage: data => {
        this.store.dispatch(createMessageAction(endpoint, data))
      },
      onClose: () => {
        this.store.dispatch(createDisonnectionAction(endpoint))
      },
      onError: (error) => {
        this.store.dispatch(createErrorAction(endpoint, error))
      }
    })

    this.storage[endpoint] = connection

    return connection
  }

  get (endpoint) {
    const connections = this.storage
    switch (typeof endpoint) {
      case 'string':
        return connections[endpoint]
      case 'boolean':
        const def = connections[this.options.defaultEndpoint]
        if (!def) throw new Error('No default Endpoint specified')
        return def
      default:
        throw new TypeError('Endpoint should be either a string, or true which means default')
    }
  }

  has (endpoint) {
    return (endpoint === true) || this.storage[endpoint] !== undefined
  }
}
