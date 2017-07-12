redux-websocket-middleware
==========================

[![build status](https://travis-ci.org/notgiorgi/redux-websocket-middleware.svg?branch=master)](https://travis-ci.org/notgiorgi/redux-websocket-middleware)

- Motivation
- Installation
- Usage
  - Middleware
  - Action Types
  - Actions

Create actions that dispatch to a websocket. For example:

```js
function writeToSocket(data) {
  return {
    type: "WRITE_DATA",
    payload: data,
    meta: { socket: true }
  }
}
```

[x] Creating and opening the WebSocket for multiple endpoints (you can have one default)
[x] Handling JSON encoding/decoding of messages
[x] Retrying the connection when lost, and exponentially backing off
[x] Batching writes when offline, and sending when available
[ ] Tests
