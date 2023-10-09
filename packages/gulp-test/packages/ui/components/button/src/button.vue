<template>
  <ElButton :type="type" @click="handlerClick">
    <slot></slot>
  </ElButton>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { buttonProps, buttonEmits } from "./props";

defineOptions({
  name: "JButton",
});

defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

function handlerClick(e: MouseEvent) {
  emit("click", e);
  alert("jaycceButton!");
}
</script>
