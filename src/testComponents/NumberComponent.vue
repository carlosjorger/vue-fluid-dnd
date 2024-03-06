<script setup lang="ts">
import { ComponentPublicInstance as setRef } from "vue";

const { number, setRef } = defineProps<{
  number: number;
  setRef: (ref: Element | setRef | null, refs: Record<string, any>) => void;
}>();
</script>
<template>
  <li :ref="setRef" class="number">
    {{ number }}
  </li>
</template>
<style>
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
}
</style>
