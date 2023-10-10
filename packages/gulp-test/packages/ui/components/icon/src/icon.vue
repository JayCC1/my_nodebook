<template>
  <i :class="prefixedName" :style="style">
    <slot>
      <component :is="component" />
    </slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { iconProps } from "./props";
import { createNamespace } from "@jaycce/gulp-utils";

defineOptions({
  name: "JIcon",
});

const { prefixedName } = createNamespace("icon");

const props = defineProps(iconProps);
const style = computed(() => ({
  ["--j-icon-font-size"]: `${props.size || 12}px`,
  ["--j-icon-color"]: props.color,
}));
</script>
<style></style>
