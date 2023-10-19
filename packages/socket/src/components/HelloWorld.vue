<template>
  <h1>{{ msg }}</h1>
</template>
<script setup lang="ts">
import { ref, defineProps } from 'vue'

type Props = {
  msg: string
}
const props = defineProps<Props>()
</script>
<style scoped></style>
