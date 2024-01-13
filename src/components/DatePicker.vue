<template>
  <input type="date" v-model="model" />
</template>
<script setup lang="ts">
const model = defineModel<Date>();
</script>
