const backoff = require('backoff')

export function isSocketAction (action) {
  return Boolean(action && action.meta && action.meta.socket)
}

export function isIncomingMessage (action) {
  return Boolean(action && action.meta && action.meta.incoming)
}

export function setBackoff (cb, failAfter = 6) {
  const bo = backoff.exponential({
    initialDelay: 1000
  })
  const doBackoff = bo.backoff.bind(bo)

  bo.on('ready', () => cb(doBackoff))

  bo.backoff()

  bo.failAfter(failAfter)
}
