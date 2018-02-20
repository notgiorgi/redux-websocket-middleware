import {
  createConnectionAction,
  createDisonnectionAction,
  createErrorAction,
  createMessageAction
} from "../actions";

import { MessageQueue, Connection } from "./";

export default class ConnectionManager {
  constructor(store, options = {}, reconnectCallback = null) {
    this.store = store;
    this.options = options;
    this.storage = {};

    if (this.options.defaultEndpoint) {
      this.add(this.options.defaultEndpoint);
    }
    this.reconnectCallback = reconnectCallback;
  }

  add(endpoint) {
    const connection = new Connection(
      endpoint,
      this.store,
      this.reconnectCallback,
      new MessageQueue(),
      this.options.codec
    ).subscribe({
      onOpen: () => {
        this.store.dispatch(createConnectionAction(endpoint));
      },
      onMessage: data => {
        this.store.dispatch(createMessageAction(endpoint, data));
      },
      onClose: close => {
        this.store.dispatch(createDisonnectionAction(endpoint, close));
      },
      onError: error => {
        this.store.dispatch(createErrorAction(endpoint, error));
      }
    });

    this.storage[endpoint] = connection;

    return connection;
  }

  get(endpoint) {
    return this.storage[endpoint];
  }

  has(endpoint) {
    return this.storage[endpoint] !== undefined;
  }
}
