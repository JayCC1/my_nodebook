// 心跳检测
interface HeartCheck {
  timeout: number
  timeoutObj: NodeJS.Timeout | null
  serverTimeoutObj: NodeJS.Timeout | null
  reset: () => HeartCheck
  start: (socket: WebSocket) => void
}

const heartCheck: HeartCheck = {
  timeout: 1000 * 6,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    return this
  },
  start: function (socket: WebSocket) {
    const self = this
    this.timeoutObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage 拿到返回的心跳就说明连接正常
      socket.send('ping')
      // 如果超过一定事件还没重置，说明后端主动断开连接
      self.serverTimeoutObj = setTimeout(() => {
        // 如果 onclosr 会执行 reconnect，我们执行 ws.close() 就行，
        // 如果直接执行 reconnect 会触发onclose 导致重连两次
        socket.close()
      }, self.timeout)
    }, this.timeout)
  }
}
export default heartCheck
