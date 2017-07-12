export default class MessageQueue {
  constructor (initialState = []) {
    this._queue = [...initialState]
  }

  enqeue (x) {
    this._queue.push(x)
  }

  dequeue (x) {
    return this._queue.shift()
  }

  empty () {
    return this._queue.length === 0
  }
}
