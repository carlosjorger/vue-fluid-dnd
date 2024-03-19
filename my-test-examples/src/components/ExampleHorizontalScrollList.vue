<script setup lang="ts">
import { ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";

const numbers = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);

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
    <div class="horizontal-scroll-list">
      <Draggable
        v-for="(element, index) in numbers"
        v-slot="{ setRef }"
        :draggable-id="'number-' + element.toString()"
        :index="index"
        ><div :ref="setRef as any" class="number" style="padding: 10px">
          {{ element }}
        </div>
      </Draggable>
    </div>
  </Droppable>
</template>
<style>
.horizontal-scroll-list {
  display: flex;
  flex-direction: row;
  width: 40%;
  height: 200px;
  overflow: auto;
}
</style>
