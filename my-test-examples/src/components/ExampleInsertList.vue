<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
const numbers = ref([1, 2, 3]);
const numberToInsert = ref(0);
const index = ref(0);
const { id } = defineProps<{
  id: string;
}>();
const { parent, insertAt } = useDragAndDrop<number>(numbers as any, {
  handlerSelector: ".number",
});
</script>
<template>
  <div class="counter-list">
    <ul ref="parent" :id="id" class="vertical-list">
      <TransitionGroup name="list">
        <li
          v-for="(element, index) in numbers"
          :index="index"
          :id="'child-counter-' + +element.toString()"
          :key="element"
          class="number"
        >
          <div class="inner-number">
            {{ element }}
          </div>
        </li>
      </TransitionGroup>
    </ul>
    <div class="insert-menu">
      <label for="number-to-insert">Number to insert<input type="number" v-model="numberToInsert"></label>
      <label for="index">Index<input type="number" v-model="index" :min="0" :max="numbers.length"></label> 

      <button
        v-on:click="
          insertAt(index, numberToInsert)
        "
      >
        Add number
      </button>
    </div>
  </div>
</template>
<style scoped>
.counter-list {
  display: flex;
  flex-direction: column;
}
.vertical-list {
  display: block;
  padding-inline: 10px;
}
.number {
  padding: 15px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  background-color: pink;
}
.inner-number {
  background-color: aqua;
}
.insert-menu{
  display: flex;
  gap: 8px;
  width: 100%;
}
.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
