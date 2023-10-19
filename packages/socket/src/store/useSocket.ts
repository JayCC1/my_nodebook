import Ws from '@/utils/socket'
import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socketStore', {
  state: (): {
    instance: undefined | Ws
    socketData: any
  } => ({
    instance: undefined,
    socketData: undefined
  }),
  actions: {
    wsInit(url: string) {
      if (!this.instance) {
        const ws = new Ws(url)
        this.instance = ws
        // 订阅type = notify 的消息
        this.wsSubscribe('notify', (data: any) => {
          console.log('接收服务器消息： ', data)
          // 每次接收到消息都会重置 socketData
          this.socketData = data
        })
      }
      return this.instance
    },
    wsSubscribe(type: string, cb: any) {
      this.instance?.subscribe(type, cb)
    },
    wsUnwsSubscribe(type: string, cb: any = () => {}) {
      this.instance?.unsubscribe(type, cb)
    },
    sendScoket(data: any) {
      this.instance?.send(JSON.stringify(data))
    },
    destroyScoket() {
      if (this.instance) {
        // 销毁socket
        this.instance.destroy()
        this.instance = undefined
      }
    }
  }
})
