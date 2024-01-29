<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";

const list = [
  {
    "draggable-id": "1",
    number: 1,
    style:
      "color: white; background-color: red; padding: 20px 0; margin: 23px 0;",
  },
  {
    "draggable-id": "2",
    number: 2,
    style:
      "color: white; background-color: blue; padding: 20px 0; margin: 12px; margin-right: 120px;",
  },
  {
    "draggable-id": "3",
    number: 3,
    style:
      "color: white; background-color: green; padding: 26px 0; margin: 26px; margin-left: 100px;",
  },
  {
    "draggable-id": "4",
    number: 4,
    style:
      "color: white; background-color: wheat; padding: 40px 0; margin: 20px 0; margin-right: 100px; width: 30%;",
  },
];
const onDrop = (source, destination) => {
  console.log(source, destination);
};
</script>

<template>
  <Droppable droppable-id="1" direction="horizontal" :onDrop="onDrop">
    <div
      style="width: 80%; display: flex; flex-direction: row; column-gap: 10%"
    >
      <Draggable draggable-id="h1" :index="0" v-slot="{ setRef }">
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
      <Draggable draggable-id="h2" :index="1" v-slot="{ setRef }">
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
      <Draggable draggable-id="h3" :index="2" v-slot="{ setRef }">
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
      <Draggable draggable-id="h4" :index="3" v-slot="{ setRef }">
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
  <Droppable droppable-id="2" direction="horizontal" :onDrop="onDrop">
    <div style="width: 30%; overflow: auto; display: flex; flex-direction: row">
      <Draggable draggable-id="h1" :index="0" v-slot="{ setRef }">
        <div
          :ref="setRef"
          style="
            color: white;
            background-color: red;
            padding: 30px;
            margin: 23px 0;
          "
        >
          1
        </div>
      </Draggable>
      <Draggable draggable-id="h2" :index="1" v-slot="{ setRef }">
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
      <Draggable draggable-id="h3" :index="2" v-slot="{ setRef }">
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
      <Draggable draggable-id="h4" :index="3" v-slot="{ setRef }">
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
      <Draggable draggable-id="h5" :index="4" v-slot="{ setRef }">
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
      <Draggable draggable-id="h6" :index="5" v-slot="{ setRef }">
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
  </Droppable>
  <div style="display: flex; flex-direction: row; column-gap: 10px">
    <Droppable droppable-id="3" direction="vertical" :onDrop="onDrop">
      <div style="width: 40%; background-color: darkgray; display: block">
        <Draggable draggable-id="1" :index="0" v-slot="{ setRef }"
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
        <Draggable draggable-id="2" :index="1" v-slot="{ setRef }">
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
        <Draggable draggable-id="3" :index="2" v-slot="{ setRef }"
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
        <Draggable draggable-id="4" :index="3" v-slot="{ setRef }"
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
        <Draggable draggable-id="5" :index="4" v-slot="{ setRef }"
          ><div
            :ref="setRef"
            style="
              color: white;
              background-color: crimson;
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
    <Droppable droppable-id="4" direction="vertical" :onDrop="onDrop">
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
        <Draggable
          v-for="(element, index) in list"
          v-slot="{ setRef }"
          :draggable-id="element['draggable-id']"
          :index="index"
          ><div :ref="setRef" :style="element.style">{{ element.number }}</div>
        </Draggable>
      </div>
    </Droppable>
  </div>
</template>
