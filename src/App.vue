<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";
</script>

<template>
  <Droppable droppable-id="3" direction="horizontal">
    <div style="width: 80%; display: flex; flex-direction: row">
      <Draggable draggable-id="h1" enable-drag v-slot="{ setRef }">
        <div
          :ref="setRef"
          style="
            color: white;
            background-color: red;
            width: 50px;
            margin: 23px 0;
          "
        >
          1
        </div>
      </Draggable>
      <Draggable draggable-id="h2" enable-drag v-slot="{ setRef }">
        <div
          :ref="setRef"
          style="
            color: white;
            background-color: blue;
            padding: 40px;
            margin: 12px;
            margin-right: 100px;
          "
        >
          2
        </div>
      </Draggable>
    </div>
  </Droppable>

  <Droppable droppable-id="2" direction="vertical">
    <div
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
    </div>
  </Droppable>
</template>
