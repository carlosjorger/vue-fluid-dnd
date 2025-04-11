<script  setup lang="ts">
    import { FRAMEWORKS_TYPES, type FRAMEWORKS_TYPE } from '@/types';
    import { ref, type Component } from 'vue';
    import svelteLogo from './icons/logos/svelte.vue';
    import vueLogo from './icons/logos/vue.vue';
    import IconSelector from './IconSelector.vue';

    
    const frameworkOptions = ref<{value: FRAMEWORKS_TYPE,label: string; icon: Component}[]>([
        {
            value: FRAMEWORKS_TYPES.vue,
            label: 'Vue',
            icon: vueLogo
        },
        {
            value: FRAMEWORKS_TYPES.svelte,
            label: 'Svelte',
            icon: svelteLogo
        }
    ])
    const currentFramework = ref<FRAMEWORKS_TYPE>()
</script>

<template>
    <IconSelector 
      v-model="currentFramework" 
      :options="frameworkOptions" 
    />
</template>