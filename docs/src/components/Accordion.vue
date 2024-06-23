<script setup lang="ts">
import { computed, ref, watch } from "vue";

const { buttonText } = defineProps<{
  buttonText: string;
}>();
let showAccordion = ref(false);

function clickButton() {
  showAccordion.value = !showAccordion.value;
}
const accordionCode = ref<HTMLElement>();
const accordionCodeHeight = ref("max-content");
const accordionCodeMaxHeight = computed(() => {
  if (showAccordion.value) {
    return accordionCodeHeight.value;
  } else {
    return `0px`;
  }
});
watch(
  accordionCode,
  () => {
    const element = accordionCode.value;
    if (!element) {
      return;
    }
    const { height } = window.getComputedStyle(element);
    accordionCodeHeight.value = height;
  },
  {
    deep: true,
  }
);
</script>
<template>
  <div class="pt-8 w-full flex items-center justify-center">
    <div
      class="w-full divide-y divide-slate-300 overflow-hidden rounded-xl border border-slate-300 bg-slate-100/40 text-slate-700 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
    >
      <div class="divide-y divide-slate-300 dark:divide-slate-700">
        <button
          id="controlsAccordionItemOne"
          type="button"
          class="flex w-full items-center justify-between gap-4 bg-slate-100 p-4 text-left underline-offset-2 hover:bg-slate-100/75 focus-visible:bg-slate-100/75 focus-visible:underline focus-visible:outline-none dark:bg-slate-800 dark:hover:bg-slate-800/75 dark:focus-visible:bg-slate-800/75"
          @click="clickButton"
        >
          {{ buttonText }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
            stroke="currentColor"
            class="size-5 shrink-0 transition"
            aria-hidden="true"
            :class="{
              'rotate-180': showAccordion,
            }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
        <div class="accordion-code-wrapper" :class="{ open: showAccordion }">
          <div id="accordionCode" ref="accordionCode" role="region">
            <div class="p-4 text-sm sm:text-base text-pretty">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.accordion-code-wrapper {
  max-height: 0;
  transition: max-height 300ms;
}
.accordion-code-wrapper.open {
  max-height: v-bind(accordionCodeMaxHeight);
}
</style>
