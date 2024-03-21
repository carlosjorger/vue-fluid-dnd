<script setup lang="ts">
import ExampleVerticalListWithChildElements from "./components/ExampleVerticalListWithChildElements.vue";
import ExampleHorizontalList from "./components/ExampleHorizontalList.vue";
import ExampleVertialScrollList from "./components/ExampleVertialScrollList.vue";
import ExampleHorizontalListWithMixedStyles from "./components/ExampleHorizontalListWithMixedStyles.vue";
import ExampleHorizontalScrollList from "./components/ExampleHorizontalScrollList.vue";
import ExampleVerticalListWithMixedStyles from "./components/ExampleVerticalListWithMixedStyles.vue";
import ExampleVerticalListWithMixedStylesAndGaps from "./components/ExampleVerticalListWithMixedStylesAndGaps.vue";
// import ExampleOfPokemonList from "./components/ExampleOfPokemonList.vue";
</script>

<template>
  <ExampleVerticalListWithChildElements
    droppableId="example-vertical-list-with-child-elements"
  />
  <ExampleHorizontalList droppableId="example-horizontal-list" />
  <ExampleVertialScrollList droppableId="example-vertical-scroll-list" />
  <ExampleHorizontalScrollList droppableId="example-horizontal-scroll-list" />
  <ExampleHorizontalListWithMixedStyles
    droppableId="example-horizontal-with-mixed-styles"
  />
  <div style="display: flex; flex-direction: row; column-gap: 10px">
    <ExampleVerticalListWithMixedStyles
      droppableId="example-vertical-with-mixed-styles"
    />
    <ExampleVerticalListWithMixedStylesAndGaps
      droppableId="example-vertical-with-mixed-styles-gaps"
    />
  </div>
  <!-- <ExampleOfPokemonList droppableId="example-pokemon-list" /> -->
</template>
