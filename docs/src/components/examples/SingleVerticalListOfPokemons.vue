<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue-fluid-dnd";
import "vue-fluid-dnd/style.css";
type PokemonLink = {
  name: string;
  url: string;
};
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
type Pokemon = {
  name: keyof typeof pokeColor;
  order: number;
  types: PokemonTypeOrder[];
  sprites: PokemonStripes;
};
type PokemonTypeOrder = {
  slot: number;
  type: PokemonType;
};
type PokemonType = {
  name: string;
};
type PokemonStripes = {
  front_default: string;
};

const pokemons = ref([] as Pokemon[]);
const { results } = await fetch(
  `https://pokeapi.co/api/v2/pokemon/?limit=9`
).then<{
  results: PokemonLink[];
}>((res) => res.json());
for (const result of results) {
  const pokemon = await fetch(result.url).then<Pokemon>((res) => res.json());
  pokemons.value.push(pokemon);
}
</script>
<template>
  <div class="flex justify-center items-start">
    <Droppable droppable-id="1" direction="vertical" :items="pokemons">
      <div
        class="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
      >
        <Draggable
          v-for="(pokemon, index) in pokemons"
          v-slot="{ setRef }"
          :draggable-id="pokemon.name"
          :index="index"
        >
          <div
            :ref="setRef"
            class="rounded-xl aspect-square border-solid border-black/40 border-4 mb-4 dark:text-gray-100 text-gray-800 pokemon bg-no-repeat p-0.5"
            :class="[pokeColor[pokemon.name]]"
          >
            <div class="p-2">
              <div class="flex flex-row items-center justify-between gap-1">
                <div class="">{{ pokemon.name }}</div>
                <div class="dark:text-gray-100/40 text-gray-800/40">
                  #{{ pokemon.order }}
                </div>
              </div>
              <img :src="pokemon.sprites.front_default" alt="pokemon" />
            </div>
            <div class="w-11/12 mx-auto rounded-md p-2 text-sm">
              <div v-for="pokemonType in pokemon.types">
                {{ pokemonType.type.name }}
              </div>
            </div>
          </div>
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
.pokemon {
  margin-top: 0rem !important;
  background-image: url("../../assets/pokemon-bg.svg");
}
</style>
<!-- TODO: refactor -->
