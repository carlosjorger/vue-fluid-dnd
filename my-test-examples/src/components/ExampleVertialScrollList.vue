<script setup lang="ts">
import { ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";
import NumberComponent from "./NumberComponent.vue";

const numbers = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);

const { droppableId } = defineProps<{
  droppableId: string;
}>();
</script>
<template>
  <Droppable :droppable-id="droppableId" direction="vertical" :items="numbers">
    <ul class="vertical-scroll-list">
      <Draggable
        v-for="(element, index) in numbers"
        v-slot="{ setRef }"
        :draggable-id="'number-' + element.toString()"
        :index="index"
        ><NumberComponent :setRef="setRef as any" :number="element" />
      </Draggable>
    </ul>
  </Droppable>
</template>
<style>
.vertical-scroll-list {
  display: block;
  width: 60%;
  height: 300px;
  overflow: auto;
  padding-inline: 5rem;
}
</style>
