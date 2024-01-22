<template>
  <component :is="tag">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
defineProps<{
  droppableId: string;
  tag: string;
}>();
</script>
<!-- TODO: keep working in Droppable -->
