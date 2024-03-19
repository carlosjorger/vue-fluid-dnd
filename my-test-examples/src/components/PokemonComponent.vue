<script setup lang="ts">
import { type ComponentPublicInstance } from "vue";
import type { Pokemon } from "../../../docs/src/components/examples/Pokemon";
const { pokemon, setRef } = defineProps<{
  pokemon: Pokemon;
  setRef: (
    ref: Element | ComponentPublicInstance | null,
    refs: Record<string, any>
  ) => void;
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
</script>

<template>
  <div :ref="setRef" :class="[pokeColor[pokemon.name]]">
    <div class="p-2">
      <div>
        <div class="">{{ pokemon.name }}</div>
        <div>#{{ pokemon.order }}</div>
      </div>
      <img :src="pokemon.sprites.front_default" alt="pokemon" />
    </div>
    <div>
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
