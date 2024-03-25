<script setup lang="ts">
import { onMounted, ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";
import PokemonComponent from "./PokemonComponent.vue";

import { fetchPokemons } from "../../../docs/src/server/pokemonServer.ts";
import type { Pokemon } from "../../../docs/src/components/examples/Pokemon";

const pokemons = ref([] as Pokemon[]);
onMounted(async () => {
  pokemons.value = await fetchPokemons(9);
});

const { droppableId } = defineProps<{
  droppableId: string;
}>();
</script>
<template>
  <Droppable :droppable-id="droppableId" direction="vertical" :items="pokemons">
    <div class="pokemon-list">
      <Draggable
        v-for="(pokemon, index) in pokemons"
        v-slot="{ setRef }"
        :draggable-id="pokemon.name"
        :index="index"
      >
        <PokemonComponent :setRef="setRef as any" :pokemon="pokemon" />
      </Draggable>
    </div>
  </Droppable>
</template>
<style>
.pokemon-list {
  width: 40%;
  background-color: darkgray;
  display: block;
}
</style>
