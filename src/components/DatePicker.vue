<template>
  <input type="date" v-model="model" />
</template>
<script setup lang="ts">
import "../style.css";

const model = defineModel<Date>();
</script>
