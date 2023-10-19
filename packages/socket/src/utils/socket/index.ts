import { webSocketEmitter } from '../mitt'
import heartCheck from './heartCheck'

let flag: boolean | null = false

function isWebSocket(obj: unknown): obj is WebSocket {
  return Object.prototype.toString.call(obj) === '[Object WebSocket]'
}

class Ws {
  url: string // websocket 接口地址
  ws: WebSocket | undefined | null // WebSocket 实例
  isReconnectionLoading: boolean = false // 重连中状态
  timeId: NodeJS.Timeout | undefined = undefined // 延时重连的 Id
  isCustomClose: boolean = false // 用户手动关闭连接
  errorStack: any[] = [] // 错误消息队列

  constructor(url: string) {
    this.url = url
    this.createWebSocket()
  }

  // 创建一个 webSocket 连接
  createWebSocket() {
    if ('WebSocket' in window) {
      if (flag) return true
      flag = true
      // 实例化 WebSocket
      this.ws = new WebSocket(this.url)
      // 监听事件
      this.onOpen()
      this.onError()
      this.onClose()
      this.onMessage()
      return true
    } else {
      console.log('你的浏览器不支持 WebSocket')
      return false
    }
  }
  wsVerify(ws: unknown): ws is WebSocket {
    if (!isWebSocket(ws)) {
      return this.createWebSocket()
    } else {
      return true
    }
  }
  // 配置监听成功钩子
  onOpen() {
    if (this.wsVerify(this.ws)) {
      this.ws.onopen = () => {
        console.log('onopen: 连接成功')
        // 连接成功。检查之前发送失败的消息，如果有就直接再次发送
        this.errorStack.forEach((msg) => {
          this.send(msg)
        })
        this.errorStack = []
        this.isReconnectionLoading = false
        // 重置心跳时间, 开启心跳
        heartCheck.reset().start(this.ws as WebSocket)
      }
    }
  }

  // 配置错误监听钩子
  onError() {
    if (this.wsVerify(this.ws)) {
      this.ws.onerror = () => {
        this.reconnection()
        this.isReconnectionLoading = false
      }
    }
  }

  // 监听关闭
  onClose() {
    if (this.wsVerify(this.ws)) {
      this.ws.onclose = () => {
        // 如果是用户手动关闭的，直接返回
        if (this.isCustomClose) return
        // 重写连接
        this.reconnection()
        this.isReconnectionLoading = false
      }
    }
  }

  // 接收到 WebSocket 消息
  onMessage() {
    if (this.wsVerify(this.ws)) {
      this.ws.onmessage = (event) => {
        console.log(event)

        try {
          const data = JSON.parse(event.data)
          // 接到消息重置心跳时间, 开启新的心跳
          heartCheck.reset().start(this.ws as WebSocket)
          if (data.data === 'pong') return
          // 发布消息到消息中心
          webSocketEmitter.emit(data.type, data)
          console.log('接收到消息:', data)
        } catch (error) {
          console.log(error, 'error')
        }
      }
    }
  }

  // 重新连接
  reconnection() {
    // 防止重复执行
    if (this.isReconnectionLoading) return
    this.isReconnectionLoading = true
    flag = null
    this.timeId && clearTimeout(this.timeId)
    this.timeId = setTimeout(() => {
      this.createWebSocket()
    }, 3000)
  }

  // 发送消息
  send(message: any) {
    // 连接失败处理
    // 0: 正在建立连接
    // 1：连接建立可以通信
    // 2：连接正在关闭
    // 3：连接已关闭或无法打开
    if (this.ws?.readyState !== 1) {
      this.errorStack.push(message)
      return
    }
    this.ws.send(message)
  }

  // 手动关闭
  close() {
    flag = null
    this.isCustomClose = true
    this.ws?.close()
  }

  // 手动开启
  start() {
    this.isCustomClose = false
    this.reconnection()
  }

  // 订阅
  subscribe(eventName: string, cb: any) {
    webSocketEmitter.on(eventName, cb)
  }

  // 取消订阅
  unsubscribe(eventName: string, cb: any) {
    webSocketEmitter.off(eventName, cb)
  }

  // 销毁
  destroy() {
    this.close()
    this.ws = null
    this.errorStack = []
    // 移除所有订阅
    webSocketEmitter.all.clear()
  }
}

export default Ws
