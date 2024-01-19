<script setup lang="ts">
import { DatePicker } from "vue-chrono-picker";
defineProps<{ msg: string }>();

let date = new Date();
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <DatePicker v-model="date" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
