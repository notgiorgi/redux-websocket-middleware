export default class JSONCodec {
  encode (message) {
    switch (typeof message) {
      case 'object':
        return JSON.stringify(message)
      default:
        return message
    }
  }

  decode (message) {
    try {
      return JSON.parse(message)
    } catch (e) {
      return message
    }
  }
}
