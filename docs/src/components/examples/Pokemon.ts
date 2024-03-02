export type Pokemon = {
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

export type PokemonLink = {
  name: string;
  url: string;
};
export const pokeColor = {
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

export const darkPokeColor = {
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
