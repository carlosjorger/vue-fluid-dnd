<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "vue-date-picker";
defineProps<{ msg: string }>();

const count = ref(0);
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
