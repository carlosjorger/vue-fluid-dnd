<script setup lang="ts">
import type { Pokemon } from "./Pokemon";

const { pokemon } = defineProps<{
  pokemon: Pokemon;
}>();

const pokeColor = {
  bulbasaur: "bg-[#64dbb2]",
  ivysaur: "bg-[#64dbb2]",
  venusaur: "bg-[#64dbb2]",
  charmander: "bg-[#f0776a]",
  charmeleon: "bg-[#f0776a]",
  charizard: "bg-[#f0776a]",
  squirtle: "bg-[#58abf6]",
  wartortle: "bg-[#58abf6]",
  blastoise: "bg-[#58abf6]",

  green: "#64dbb2",
  orange: "#f0776a",
  blue: "#58abf6",
  yellow: "#facd4b",
  purple: "#9f5bba",
  coco: "#ca8179",
} as const;

const darkPokeColor = {
  bulbasaur: "dark:bg-[#429075]",
  ivysaur: "dark:bg-[#429075]",
  venusaur: "dark:bg-[#429075]",
  charmander: "dark:bg-[#8e463f]",
  charmeleon: "dark:bg-[#8e463f]",
  charizard: "dark:bg-[#8e463f]",
  squirtle: "dark:bg-[#3a72a4]",
  wartortle: "dark:bg-[#3a72a4]",
  blastoise: "dark:bg-[#3a72a4]",

  green: "#64dbb2",
  orange: "#f0776a",
  blue: "#58abf6",
  yellow: "#facd4b",
  purple: "#9f5bba",
  coco: "#ca8179",
} as const;
</script>

<template>
  <div
    class="rounded-xl border-solid border-black/40 border-4 mb-4 dark:text-gray-100 text-gray-800 pokemon bg-no-repeat p-0.5"
    :class="[pokeColor[pokemon.name], darkPokeColor[pokemon.name]]"
  >
    <div class="p-2 max-sm:text-sm">
      <div class="flex flex-row items-center justify-between gap-1">
        <div class="">{{ pokemon.name }}</div>
        <div class="dark:text-gray-100/40 text-gray-800/40">
          #{{ pokemon.order }}
        </div>
      </div>
      <img :src="pokemon.sprites.front_default" alt="pokemon" />
    </div>
    <div
      class="w-11/12 mx-auto bg-gray-100/20 rounded-md p-2 text-sm max-sm:text-xs"
    >
      <div v-for="pokemonType in pokemon.types">
        {{ pokemonType.type.name }}
      </div>
    </div>
  </div>
</template>
<style>
.pokemon {
  margin-top: 0rem !important;
  background-image: url("../../assets/pokemon-bg.svg");
}
</style>
