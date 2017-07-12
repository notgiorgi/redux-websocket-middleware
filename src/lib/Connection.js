import { setBackoff } from '../utils'
import MessageQueue from './MessageQueue'
import { JSONCodec } from './Codecs'

export default class Connection {
  constructor (endpoint, queue = new MessageQueue(), codec = JSONCodec, Socket = window.WebSocket) {
    this.queue = queue
    this.endpoint = endpoint
    this.backingOff = false
    this.codec = codec
    this.Socket = Socket
  }

  subscribe ({ onMessage, onOpen, onError, onClose }) {
    this.connection = new this.Socket(this.endpoint)

    this.handlers = {
      onMessage,
      onOpen,
      onError,
      onClose
    }

    Object.assign(
      this.connection,
      {
        onopen: this._onOpen(onOpen).bind(this),
        onerror: this._onError(onError).bind(this),
        onmessage: this._onMessage(onMessage).bind(this),
        onclose: this._onClose(onClose).bind(this)
      }
    )

    return this
  }

  unsubscribe () {
    this.connection.close()
  }

  isConnected () {
    return this.connection.readyState === WebSocket.OPEN
  }

  send (data) {
    if (this.isConnected()) {
      this.connection.send(
        this.codec.encode(data)
      )
    } else {
      this.queue.enqeue(data)
    }
  }

  _onOpen (cb) {
    return () => {
      while (!this.queue.empty() && this.isConnected()) {
        this.send(this.queue.dequeue())
      }

      cb()
    }
  }

  _onMessage (cb) {
    return event => {
      cb(
        this.codec.decode(event.data)
      )
    }
  }

  _onError (cb) {
    return err => {
      if (!this.backingOff) {
        this.backingOff = true
        setBackoff(reset => {
          if (this.connection.readyState !== WebSocket.OPEN) {
            this.subscribe(this.handlers)
            reset()
          } else {
            this.backingOff = false
          }
        })
      }
      cb(err)
    }
  }

  _onClose(cb) {
    return this._onError(cb)
  }
}
