<template>
    <div class="icon-selector">
      <button 
        class="selector-input px-2 py-1.5 relative"
        @click="(()=>toggleDropdown())"
      >
        <div class="selected-option">
          <component 
            :is="selectedOption.icon" 
            v-if="selectedOption.icon" 
            class="option-icon"
          />
          <span class="option-label">{{ selectedOption.label }}</span>
        </div>
        <ChevronDownIcon class="dropdown-icon" />
      </button>
  
      <div v-if="isOpen" class="dropdown-menu">
        <div
          v-for="option in options"
          :key="option.value"
          class="dropdown-item"
          @click="selectOption(option)"
        >
          <component 
            :is="option.icon" 
            v-if="option.icon" 
            class="option-icon"
          />
          <span class="option-label">{{ option.label }}</span>
        </div>
      </div>
    </div>
  </template>
  
<script  setup lang="ts">
  import { ref } from 'vue';
  
  interface SelectOption {
    value: string | number;
    label: string;
    icon?: any; // Vue component
  }
  const model = defineModel({ type: String })

  const props = defineProps({
    options: {
      type: Array as () => SelectOption[],
      required: true,
      validator: (options: SelectOption[]) => 
        options.every(opt => opt.value !== undefined && opt.label)
    }
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
  }>()

  const isOpen = ref(false);
    
  const selectedOption = ref<SelectOption>(
    props.options.find(opt => opt.value === model.value) || props.options[0]
  );

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    console.log(isOpen.value)
  };

  const selectOption = (option: SelectOption) => {
    selectedOption.value = option;
    emit('update:modelValue', option.value);
    isOpen.value = false;
  };
</script>
  
  <style scoped>
  .icon-selector {
    position: relative;
    width: 100%;
    max-width: 300px;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .selector-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .selector-input:hover {
    border-color: #cbd5e0;
  }
  
  .selected-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .dropdown-icon {
    width: 16px;
    height: 16px;
    color: #718096;
    transition: transform 0.2s ease;
  }
  
  .icon-selector[aria-expanded="true"] .dropdown-icon {
    transform: rotate(180deg);
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .dropdown-item:hover {
    background-color: #f7fafc;
  }
  
  .option-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  
  .option-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>