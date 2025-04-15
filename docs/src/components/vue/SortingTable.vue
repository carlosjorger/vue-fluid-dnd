<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";

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
const [ parent ] = useDragAndDrop(table, {
  draggingClass: "drag-row",
});
</script>
<template>
  <table class="table-auto border-collapse">
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
<style scoped>
table {
  display: table;
  background-color: var(--sl-color-gray-1);
  width: 400px;
}
table thead {
  color: var(--sl-color-gray-6);
}
table tbody tr {
  margin-top: 0;
  background-color: var(--sl-color-gray-7, var(--sl-color-gray-6));
  transition-property: color, background-color;
  transition-duration: 250ms;
}
table tbody tr td {
  margin-top: 0;
  border: 0;
  width: 33.3%;
}
.drag-row {
  background-color: var(--sl-color-text-accent) !important;
  color: var(--sl-color-text-invert);
  transition-property: color, background-color;
  transition-duration: 250ms;
  display: table;
}
:deep(.temp-child) {
  margin-top: 0;
}
</style>
