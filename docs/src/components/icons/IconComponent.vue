<script setup lang="ts">
  const {option} = defineProps({
    option: {
      type: Object,
      required: true,
    }
  })
</script>
<template>
    <component 
        :is="option.icon" 
        v-if="option.icon" 
        class="w-4 h-4 flex-shrink-0"
    />
    <span class="whitespace-nowrap text-ellipsis">{{ option.label }}</span>
</template>