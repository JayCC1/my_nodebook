<template>
  <ElButton :type="type" @click="handlerClick">Primary</ElButton>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { buttonProps } from "./props";

defineProps(buttonProps);

function handlerClick() {
  alert("jaycceButton!");
}
</script>
