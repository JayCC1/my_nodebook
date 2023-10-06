<template>
  <i class="j-icon" :style="style">
    <slot></slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { iconProps } from "./props";

defineOptions({
  name: "JIcon",
});

const props = defineProps(iconProps);
const style = computed(() => ({
  ["--j-icon-font-size"]: `${props.size || 12}px`,
  ["--j-icon-color"]: props.color,
}));
</script>
<style></style>
./props
