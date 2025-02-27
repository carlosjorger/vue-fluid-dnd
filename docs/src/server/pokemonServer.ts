import type { Pokemon, PokemonLink } from "../components/examples/Pokemon";
import { ref, type Ref } from "vue";

export const fetchPokemons = async (limit: number, offset: number = 0, notIncluded: Ref<Pokemon[]>= ref([])) => {
  const finalLimit = limit + notIncluded.value.length
  const pokemons = [] as Pokemon[];
  const { results } = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${finalLimit}&offset=${offset}`
  ).then<{
    results: PokemonLink[];
  }>((res) => res.json());

  for (const result of results) {
    const pokemon = await fetch(result.url).then<Pokemon>((res) => res.json());
    if (notIncluded.value.some(p => p.name === pokemon.name)) {
      continue;
    }
    pokemons.push(pokemon);
  }
  return pokemons;
};

async function getPokemonByNumber(pokemonNumber:number){
  const { results } = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`
  ).then<{
    results: PokemonLink[];
  }>((res) => res.json());
  const [pokemonLink] = results
  const pokemon = await fetch(pokemonLink.url).then<Pokemon>((res) => res.json());
  return pokemon
}