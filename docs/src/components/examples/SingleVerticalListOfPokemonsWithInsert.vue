<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";
import type { Pokemon } from "./Pokemon";
import PokemonComponent from "./PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = ref([] as Pokemon[]);
watch(pokemons,async()=>{
  pokemonsToSelected.value = await fetchPokemons(10,0, pokemons)
},{
  deep: true
})
pokemons.value = await fetchPokemons(3);
const { parent, insertAt } = useDragAndDrop(pokemons, {
  removingClass: "removed",
  delayBeforeRemove: 300,
});
const pokemonsToSelected = ref([] as Pokemon[]);
const pokemonToAdd = ref<Pokemon>()
</script>
<template>
  <div class="flex max-sm:justify-center items-start">
    <div
      ref="parent"
      class="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
    >
      <PokemonComponent
        v-for="(pokemon, index) in pokemons"
        :key="pokemon.name"
        :index="index"
        :pokemon="pokemon"
      />
    </div>
    <select v-model="pokemonToAdd">
      <option disabled :value="null">Please select one</option>
      <option v-for="(pokemon, index) in pokemonsToSelected" :value="pokemon">{{pokemon.name}}</option>
    </select>
  </div>
</template>
<style>
.sl-markdown-content
  :not(a, strong, em, del, span, input, code)
  + :not(a, strong, em, del, span, input, code, :where(.not-content *)) {
  margin-top: 0rem !important;
}
</style>
