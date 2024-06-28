<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
type Person = {
  name: string;
  age: number;
};
const table = ref<Person[]>([
  { name: "Carlos", age: 26 },
  { name: "Jorgito", age: 34 },
  { name: "Ivis", age: 68 },
]);
const { parent } = useDragAndDrop<Person>(table);
</script>
<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody ref="parent">
      <tr v-for="(person, index) in table" :index="index" :key="person.name">
        <td>{{ person.name }}</td>
        <td>{{ person.age }}</td>
      </tr>
    </tbody>
  </table>
</template>
<style>
table {
  width: 400px;
}
table tbody tr td {
  width: 50%;
  border: 2px solid;
}
</style>
