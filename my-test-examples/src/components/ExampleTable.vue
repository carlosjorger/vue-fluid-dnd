<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
type Person = {
  name: string;
  age: number;
  alias: string;
};
const table = ref<Person[]>([
  { name: "Carlos", age: 26, alias: "Carli" },
  { name: "Jorgito", age: 34, alias: "Pipo" },
  { name: "Ivis", age: 68, alias: "Mamá" },
]);
const { parent } = useDragAndDrop<Person>(table);
</script>
<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Alias</th>
      </tr>
    </thead>
    <tbody ref="parent">
      <tr v-for="(person, index) in table" :index="index" :key="person.name">
        <td>{{ person.name }}</td>
        <td>{{ person.age }}</td>
        <td>{{ person.alias }}</td>
      </tr>
    </tbody>
  </table>
</template>
<style>
table {
  width: 400px;
}
.dragging {
  display: table;
}
table tbody tr {
  display: table-row;
}
table tbody tr td {
  width: 80px;
}
</style>
