<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue-fluid-dnd";
import "vue-fluid-dnd/style.css";
import type { Pokemon } from "./Pokemon";
import PokemonComponent from "./PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = ref([] as Pokemon[]);
pokemons.value = await fetchPokemons(9);
</script>
<template>
  <div class="flex justify-center items-start">
    <Droppable droppable-id="1" direction="horizontal" :items="pokemons">
      <div
        class="bg-gray-200/60 border-solid border-black/40 rounded-2xl border-4 p-4 max-sm:p-2 flex flex-row overflow-auto gap-2 max-sm:gap-1"
      >
        <Draggable
          v-for="(pokemon, index) in pokemons"
          v-slot="{ setRef }"
          :draggable-id="pokemon.name"
          :index="index"
        >
          <PokemonComponent
            class="min-w-44 max-sm:min-w-32"
            :setRef="setRef"
            :pokemon="pokemon"
          />
        </Draggable>
      </div>
    </Droppable>
  </div>
</template>
<style>
.sl-markdown-content
  :not(a, strong, em, del, span, input, code)
  + :not(a, strong, em, del, span, input, code, :where(.not-content *)) {
  margin-top: 0rem !important;
}
</style>
