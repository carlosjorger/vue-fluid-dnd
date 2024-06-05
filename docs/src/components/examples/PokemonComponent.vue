<script setup lang="ts">
import Handler from "../icons/handler.vue";
import type { Pokemon } from "./Pokemon";

const { pokemon, handlerClass } = defineProps<{
  pokemon: Pokemon;
  handlerClass?: string;
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

  chikorita: "bg-[#64dbb2]",
  bayleef: "bg-[#64dbb2]",
  meganium: "bg-[#64dbb2]",
  cyndaquil: "bg-[#f0776a]",
  quilava: "bg-[#f0776a]",
  typhlosion: "bg-[#f0776a]",
  totodile: "bg-[#6BB5E7]",
  croconaw: "bg-[#6BB5E7]",
  feraligatr: "bg-[#6BB5E7]",

  treecko: "bg-[#64dbb2]",
  grovyle: "bg-[#64dbb2]",
  sceptile: "bg-[#64dbb2]",
  torchic: "bg-[#f0776a]",
  combusken: "bg-[#f0776a]",
  blaziken: "bg-[#f0776a]",
  mudkip: "bg-[#58abf6]",
  marshtomp: "bg-[#58abf6]",
  swampert: "bg-[#58abf6]",

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

  chikorita: "dark:bg-[#429075]",
  bayleef: "dark:bg-[#429075]",
  meganium: "dark:bg-[#429075]",
  cyndaquil: "dark:bg-[#8e463f]",
  quilava: "dark:bg-[#8e463f]",
  typhlosion: "dark:bg-[#8e463f]",
  totodile: "dark:bg-[#3a72a4]",
  croconaw: "dark:bg-[#3a72a4]",
  feraligatr: "dark:bg-[#3a72a4]",

  treecko: "dark:bg-[#429075]",
  grovyle: "dark:bg-[#429075]",
  sceptile: "dark:bg-[#429075]",
  torchic: "dark:bg-[#8e463f]",
  combusken: "dark:bg-[#8e463f]",
  blaziken: "dark:bg-[#8e463f]",
  mudkip: "dark:bg-[#3a72a4]",
  marshtomp: "dark:bg-[#3a72a4]",
  swampert: "dark:bg-[#3a72a4]",

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
    class="rounded-xl border-solid border-black/40 border-4 mb-4 max-sm:mb-0.5 dark:text-gray-100 text-gray-800 pokemon bg-no-repeat p-0.5"
    :class="[pokeColor[pokemon.name], darkPokeColor[pokemon.name]]"
  >
    <div class="p-2 max-sm:text-xs">
      <div class="flex flex-row items-center justify-between gap-1">
        <span v-if="handlerClass" :class="[handlerClass]"> <Handler /></span>

        <div class="">{{ pokemon.name }}</div>
        <div class="dark:text-gray-100/40 max-sm:text-xs text-gray-800/40">
          #{{ pokemon.order }}
        </div>
      </div>
      <img
        :src="pokemon.sprites.front_default"
        class="aspect-square"
        alt="pokemon"
      />
    </div>
    <div
      class="w-11/12 mx-auto bg-gray-100/20 rounded-md p-2 max-sm:p-1 text-sm max-sm:text-xs grid gap-1 grid-cols-2"
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
