<template>
  <h1>{{ msg }}</h1>
  <button @click="onsend">send</button>
</template>
<script setup>
const msg = ref('HelloWorld')
</script>
<style scoped></style>
