import isEqual from "lodash.isequal"

export default class MessageQueue {
  constructor (initialState = []) {
    this._queue = [...initialState]
  }

  enqeue (x, enqueueOnce = false) {
    if (enqueueOnce) {
      const included = this._queue.filter(y => isEqual(x, y))
      if (included.length === 0) {
        this._queue.push(x)
      }
    } else {
      this._queue.push(x)
    }
  }

  dequeue (x) {
    return this._queue.shift()
  }

  empty () {
    return this._queue.length === 0
  }
}
