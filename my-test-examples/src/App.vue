<script setup lang="ts">
import ExampleVerticalListWithChildElements from "./components/ExampleVerticalListWithChildElements.vue";
import ExampleHorizontalList from "./components/ExampleHorizontalList.vue";
import ExampleVertialScrollList from "./components/ExampleVertialScrollList.vue";
import ExampleHorizontalListWithMixedStyles from "./components/ExampleHorizontalListWithMixedStyles.vue";
import ExampleHorizontalScrollList from "./components/ExampleHorizontalScrollList.vue";
// import ExampleOfPokemonList from "./components/ExampleOfPokemonList.vue";
import ExampleCounterList from "./components/ExampleCounterList.vue";
import ExampleVerticalListWithHandler from "./components/ExampleVerticalListWithHandler.vue";
import ExampleGroupOflist from "./components/ExampleGroupOflist.vue";
import ExampleGroupOfListWithStyles from "./components/ExampleGroupOfListWithStyles.vue";
</script>

<template>
  <ExampleVerticalListWithChildElements
    id="example-vertical-list-with-child-elements"
  />
  <ExampleHorizontalList id="example-horizontal-list-with-child-elements" />
  <ExampleVerticalListWithHandler id="example-horizontal-list-with-handler" />
  <ExampleVertialScrollList id="example-vertical-scroll-list" />
  <ExampleHorizontalScrollList id="example-horizontal-scroll-list" />
  <ExampleHorizontalListWithMixedStyles
    id="example-horizontal-with-mixed-styles"
  />
  <ExampleGroupOfListWithStyles id="example-vertical-with-mixed-styles-gaps" />
  <div class="example-cols">
    <!-- <ExampleOfPokemonList id="example-pokemon-list" /> -->
    <ExampleCounterList id="example-counter-list" />
  </div>
  <ExampleGroupOflist id="example-group-list" />
</template>
<style>
.example-cols {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
</style>
