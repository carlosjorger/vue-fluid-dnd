# vue3-juice-dnd

## 👋 Introduction

**Juicy**, **smooth** and **versatil** drag and drop for lists with Vue.

## ✨ Features

- ✅ **Easy to install**.
- ✅ **Fully customizable**.
- ✅ **Work with horizontal and vertical list**.
- 🔲 **Fully tested, typed and reliable**.
- 🔲 **Nice documentation and examples**.

## 🚀 Getting Started

1. **Install vue3-juice-dnd:**

   ```bash
   # with npm:
   npm i vue3-juice-dnd

   # with yarn:
   yarn add vue3-juice-dnd

   # with pnpm:
   pnpm i vue3-juice-dnd

   # with ultra:
   ultra install vue3-juice-dnd
   ```

2. **Import components**

   ```js
   import { Draggable, Droppable } from "vue3-juice-dnd";
   ```

3. **Create a list that your want to sort**

   ```js
   // Each element have its own styles or classes and the draggable-id
   const listToSort = ref([
     {
       "draggable-id": "h1",
       number: 1,
       style:
         "color: white; background-color: red; width: 50px; margin: 23px 0;",
     },
     //...
   ]);
   ```

4. **Use the components**

   ```jsx
   //pass setRef to child to have the reference of draggable element
   //pass the direction of the list and droppable id
   <Droppable droppable-id="droppable-id" direction="vertical" :items="list1">
   <div style="width: 40%; background-color: darkgray; display: block">
       <Draggable
       v-for="(element, index) in listToSort"
       v-slot="{ setRef }"
       :draggable-id="element['draggable-id']"
       :index="index"
       >
       <div :ref="setRef" :style="element.style">{{ element.number }}</div>
       </Draggable>
   </div>
   </Droppable>
   ```

## 🤝 Contributing

If you're interested in contributing to Fvue3-juice-dnd JS, please read our contributing docs before submitting a pull request [CONTRIBUTING](./CONTRIBUTING.md).cc
