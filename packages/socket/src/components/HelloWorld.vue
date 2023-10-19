<template>
  <h1>{{ msg }}</h1>
</template>
<script setup lang="ts">
import { useSocketStore } from '@/store/useSocket'
type Props = {
  msg: string
}
defineProps<Props>()
const socketStore = useSocketStore()
socketStore.wsInit('ws://127.0.0.1:8080')
socketStore.wsSubscribe('test', (data: any) => {
  console.log('测试:', data)
})
</script>
<style scoped></style>
