<script setup lang="ts">
import { ref } from "vue";

import { DatePicker } from "vue-chrono-picker";
defineProps<{ msg: string }>();

const count = ref(0);
console.log(count);
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
