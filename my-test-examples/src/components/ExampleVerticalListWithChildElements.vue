<script setup lang="ts">
import { ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";

const numbers = ref([1, 2, 3, 4, 5, 6]);
</script>
<template>
  <Droppable droppable-id="5" direction="vertical" :items="numbers">
    <ul
      id="example-vertical-list-with-child-elements"
      style="display: block; padding-inline: 10px"
    >
      <Draggable
        v-for="(element, index) in numbers"
        v-slot="{ setRef }"
        :draggable-id="'number-' + element.toString()"
        :index="index"
        ><li
          :id="'child-with-children-' + +element.toString()"
          :ref="setRef as any"
          class="number"
        >
          {{ element }}
          <div style="display: flex; flex-direction: row">
            <span v-for="number in [...Array(4).keys()]">
              {{ number + element }}
            </span>
          </div>
        </li>
      </Draggable>
    </ul>
  </Droppable>
</template>
<style>
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>
