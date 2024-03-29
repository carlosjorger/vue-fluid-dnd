<script setup lang="ts">
import { ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";

const numbers = ref([1, 2, 3, 4, 5, 6, 7]);

const { droppableId } = defineProps<{
  droppableId: string;
}>();
</script>
<template>
  <Droppable
    :droppable-id="droppableId"
    direction="horizontal"
    :items="numbers"
  >
    <div id="example-vertical-list-with-child-elements" class="list">
      <Draggable
        v-for="(element, index) in numbers"
        v-slot="{ setRef }"
        :draggable-id="'number-' + element.toString()"
        :index="index"
        ><div
          :id="'horizontal-child-' + +element.toString()"
          :ref="setRef as any"
          class="number"
        >
          {{ element }}
          <div style="display: flex; flex-direction: row">
            <span v-for="number in [...Array(4).keys()]">
              {{ number + element }}
            </span>
          </div>
        </div>
      </Draggable>
    </div>
  </Droppable>
</template>
<style>
.list {
  display: flex;
  padding: 10px;
  flex-direction: row;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  transition: all 150ms ease;
}
.number:hover {
  background-color: red;
}
</style>
