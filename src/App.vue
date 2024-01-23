<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";
</script>

<template>
  <div style="width: 80%; display: flex; flex-direction: row; gap: 10px">
    <Draggable draggable-id="1" enable-drag v-slot="{ setRef }">
      <div
        :ref="setRef"
        style="
          color: white;
          background-color: red;
          width: 90px;
          margin-bottom: 10px;
          height: 100px;
        "
      >
        1
      </div>
    </Draggable>
    <Draggable draggable-id="1" enable-drag v-slot="{ setRef }">
      <div
        :ref="setRef"
        style="color: white; background-color: blue; width: 120px"
      >
        2
      </div>
    </Draggable>
  </div>
  <Droppable
    tag="div"
    droppable-id="2"
    style="
      width: 80%;
      background-color: darkgray;
      display: inline-block;
      overflow: hidden;
      display: block;
    "
  >
    <Draggable draggable-id="1" enable-drag v-slot="{ setRef }"
      ><div
        :ref="setRef"
        style="
          color: white;
          background-color: red;
          padding: 20px 0;
          margin: 23px 0;
        "
      >
        1
      </div>
    </Draggable>
    <Draggable draggable-id="2" enable-drag v-slot="{ setRef }">
      <div
        :ref="setRef"
        style="
          color: white;
          background-color: blue;
          padding: 20px 0;
          margin: 12px;
          margin-right: 300px;
        "
      >
        2
      </div>
    </Draggable>
    <Draggable draggable-id="3" enable-drag v-slot="{ setRef }"
      ><div
        :ref="setRef"
        style="
          color: white;
          background-color: green;
          padding: 26px 0;
          margin: 26px;
          margin-left: 100px;
        "
      >
        3
      </div>
    </Draggable>
    <Draggable draggable-id="3" enable-drag v-slot="{ setRef }"
      ><div
        :ref="setRef"
        style="
          color: white;
          background-color: wheat;
          padding: 26px 0;
          margin: 20px 0;
          margin-right: 100px;
        "
      >
        4
      </div>
    </Draggable>
  </Droppable>
</template>
