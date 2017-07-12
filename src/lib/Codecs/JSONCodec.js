export default class JSONCodec {
  static encode (message) {
    switch (typeof message) {
      case 'object':
        return JSON.stringify(message)
      default:
        return message
    }
  }

  static decode (message) {
    try {
      return JSON.parse(message)
    } catch (e) {
      return message
    }
  }
}
