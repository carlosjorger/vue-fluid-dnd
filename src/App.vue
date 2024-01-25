<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";
</script>

<template>
  <Droppable droppable-id="1" direction="horizontal">
    <div
      style="width: 80%; display: flex; flex-direction: row; column-gap: 10%"
    >
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
            padding: 30px;
            margin: 12px;
            margin-right: 30px;
          "
        >
          2
        </div>
      </Draggable>
      <Draggable draggable-id="h3" enable-drag v-slot="{ setRef }">
        <div
          :ref="setRef"
          style="
            color: white;
            background-color: blueviolet;
            padding: 10px;
            margin: 8px;
            height: 70px;
          "
        >
          3
        </div>
      </Draggable>
      <Draggable draggable-id="h4" enable-drag v-slot="{ setRef }">
        <div
          :ref="setRef"
          style="
            color: white;
            background-color: chocolate;
            padding: 10px;
            margin: 8px;
            width: 7%;
          "
        >
          4
        </div>
      </Draggable>
    </div>
  </Droppable>
  <Droppable droppable-id="1" direction="horizontal">
    <div
      style="
        width: 40%;

        display: flex;
        overflow: auto;
      "
    >
      <div style="min-width: 50%; display: flex; flex-direction: row">
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
              padding: 30px;
              margin: 12px;
              margin-right: 30px;
            "
          >
            2
          </div>
        </Draggable>
        <Draggable draggable-id="h3" enable-drag v-slot="{ setRef }">
          <div
            :ref="setRef"
            style="
              color: white;
              background-color: blueviolet;
              padding: 10px;
              margin: 8px;
              height: 70px;
            "
          >
            3
          </div>
        </Draggable>
        <Draggable draggable-id="h4" enable-drag v-slot="{ setRef }">
          <div
            :ref="setRef"
            style="
              color: white;
              background-color: chocolate;
              padding: 10px;
              margin: 8px;
              width: 7%;
            "
          >
            4
          </div>
        </Draggable>
        <Draggable draggable-id="h5" enable-drag v-slot="{ setRef }">
          <div
            :ref="setRef"
            style="
              color: white;
              background-color: chocolate;
              padding: 10px;
              margin-left: 40px;
              width: 7%;
            "
          >
            5
          </div>
        </Draggable>
        <Draggable draggable-id="h6" enable-drag v-slot="{ setRef }">
          <div
            :ref="setRef"
            style="
              color: white;
              background-color: chocolate;
              padding: 10px;
              margin-left: 40px;
              width: 7%;
            "
          >
            6
          </div>
        </Draggable>
      </div>
    </div>
  </Droppable>
  <div style="display: flex; flex-direction: row; column-gap: 10px">
    <Droppable droppable-id="3" direction="vertical">
      <div style="width: 40%; background-color: darkgray; display: block">
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
              margin-right: 120px;
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
              background-color: brown;
              padding: 26px 0;
              margin: 27px;
            "
          >
            4
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
            5
          </div>
        </Draggable>
      </div>
    </Droppable>
    <Droppable droppable-id="4" direction="vertical">
      <div
        style="
          width: 40%;
          background-color: darkgray;
          display: inline-block;
          overflow: hidden;
          display: block;
          display: flex;
          flex-direction: column;
          gap: 5px;
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
              margin-right: 120px;
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
              padding: 40px 0;
              margin: 20px 0;
              margin-right: 100px;
              width: 30%;
            "
          >
            4
          </div>
        </Draggable>
      </div>
    </Droppable>
  </div>
</template>
