<script setup lang="ts">
import { ref, onMounted } from "vue";
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";
import NumberComponent from "./testComponents/NumberComponent.vue";
import { fetchPokemons } from "../docs/src/server/pokemonServer.ts";
import type { Pokemon } from "../docs/src/components/examples/Pokemon";

const colList1 = ref([
  {
    "draggable-id": "h1",
    number: 1,
    style: "color: white; background-color: red; width: 50px; margin: 23px 0;",
  },
  {
    "draggable-id": "h2",
    number: 2,
    style:
      "color: white; background-color: blue; padding: 30px; margin: 12px; margin-right: 30px;",
  },
  {
    "draggable-id": "h3",
    number: 3,
    style:
      "color: white; background-color: blueviolet; padding: 10px; margin: 8px; height: 70px;",
  },
  {
    "draggable-id": "h4",
    number: 4,
    style:
      "color: white; background-color: chocolate; padding: 10px; margin: 8px; width: 7%;",
  },
]);
const colList2 = ref([
  {
    "draggable-id": "h1",
    number: 1,
    style:
      "color: white; background-color: red; padding: 30px; margin: 23px 0;",
  },
  {
    "draggable-id": "h2",
    number: 2,
    style:
      "color: white; background-color: blue; padding: 30px; margin: 12px; margin-right: 30px;",
  },
  {
    "draggable-id": "h3",
    number: 3,
    style:
      "color: white; background-color: blueviolet; padding: 10px; margin: 8px; height: 70px;",
  },
  {
    "draggable-id": "h4",
    number: 4,
    style:
      "color: white; background-color: chocolate; padding: 10px; margin: 8px; width: 7%;",
  },
  {
    "draggable-id": "h5",
    number: 5,
    style:
      "color: white; background-color: chocolate; padding: 10px; margin-left: 40px; width: 7%;",
  },
  {
    "draggable-id": "h6",
    number: 6,
    style:
      "color: white; background-color: chocolate; padding: 10px; margin-left: 40px; width: 7%;",
  },
]);
const list1 = ref([
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
      "color: white; background-color: wheat; padding: 30px 0; margin: 20px 0; margin-right: 100px; width:40%",
  },
  {
    "draggable-id": "5",
    number: 5,
    style:
      "color: white; background-color: crimson; padding: 26px 0; margin: 20px 0; margin-right: 100px;",
  },
]);

const list2 = ref([
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
      "color: white; background-color: brown; padding: 26px 0; margin: 27px;",
  },
]);
const numbers1 = ref([1, 2, 3, 4, 5, 6]);
const numbers2 = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);
const numbers3 = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]);
const pokemons = ref([] as Pokemon[]);
onMounted(async () => {
  // pokemons.value = await fetchPokemons(9);
});
</script>

<template>
  <Droppable droppable-id="1" direction="horizontal" :items="colList1">
    <div
      style="width: 80%; display: flex; flex-direction: row; column-gap: 10%"
    >
      <Draggable
        v-for="(element, index) in colList1"
        v-slot="{ setRef }"
        :draggable-id="element['draggable-id']"
        :index="index"
        ><div :ref="setRef" :style="element.style">{{ element.number }}</div>
      </Draggable>
    </div>
  </Droppable>
  <Droppable droppable-id="2" direction="horizontal" :items="colList2">
    <div style="width: 30%; overflow: auto; display: flex; flex-direction: row">
      <Draggable
        v-for="(element, index) in colList2"
        v-slot="{ setRef }"
        :draggable-id="element['draggable-id']"
        :index="index"
        ><div :ref="setRef" :style="element.style">{{ element.number }}</div>
      </Draggable>
    </div>
  </Droppable>
  <div style="padding: 2rem; background-color: gray">
    <Droppable droppable-id="5" direction="vertical" :items="numbers1">
      <ul style="display: block; padding-inline: 10px">
        <Draggable
          v-for="(element, index) in numbers1"
          v-slot="{ setRef }"
          :draggable-id="'number-' + element.toString()"
          :index="index"
          ><li :ref="setRef" class="number2">
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
  </div>
  <Droppable droppable-id="6" direction="vertical" :items="numbers2">
    <ul
      style="
        display: block;
        width: 60%;
        height: 300px;
        overflow: auto;
        padding-inline: 5rem;
      "
    >
      <Draggable
        v-for="(element, index) in numbers2"
        v-slot="{ setRef }"
        :draggable-id="'number-' + element.toString()"
        :index="index"
        ><NumberComponent :setRef="setRef" :number="element" />
      </Draggable>
    </ul>
  </Droppable>
  <Droppable droppable-id="6.5" direction="horizontal" :items="numbers3">
    <div
      style="
        display: flex;
        flex-direction: row;
        width: 40%;
        height: 200px;
        overflow: auto;
      "
    >
      <Draggable
        v-for="(element, index) in numbers3"
        v-slot="{ setRef }"
        :draggable-id="'number-' + element.toString()"
        :index="index"
        ><div :ref="setRef" class="number" style="padding: 10px">
          {{ element }}
        </div>
      </Draggable>
    </div>
  </Droppable>
  <div style="display: flex; flex-direction: row; column-gap: 10px">
    <Droppable droppable-id="7" direction="vertical" :items="list1">
      <div style="width: 40%; background-color: darkgray; display: block">
        <Draggable
          v-for="(element, index) in list1"
          v-slot="{ setRef }"
          :draggable-id="element['draggable-id']"
          :index="index"
          ><div :ref="setRef" :style="element.style">{{ element.number }}</div>
        </Draggable>
      </div>
    </Droppable>
    <Droppable droppable-id="8" direction="vertical" :items="list2">
      <div class="droppable-gaps">
        <Draggable
          v-for="(element, index) in list2"
          v-slot="{ setRef }"
          :draggable-id="element['draggable-id']"
          :index="index"
          ><div :ref="setRef" :style="element.style">{{ element.number }}</div>
        </Draggable>
      </div>
    </Droppable>
  </div>
  <Droppable droppable-id="1" direction="vertical" :items="pokemons">
    <div style="width: 40%; background-color: darkgray; display: block">
      <Draggable
        v-for="(pokemon, index) in pokemons"
        v-slot="{ setRef }"
        :draggable-id="pokemon.name"
        :index="index"
      >
        <div :ref="setRef" class="number">{{ pokemon.name }}</div>
      </Draggable>
    </div>
  </Droppable>
</template>
<style>
.droppable-gaps {
  width: 40%;
  background-color: darkgray;
  display: inline-block;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
}
.number2 {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>
./testComponents/NumberComponent.vue/index.ts
