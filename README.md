 <h1 align="center">
    <img src="https://github.com/carlosjorger/vue-fluid-dnd/assets/50055316/cdec8638-d074-4f26-8c72-92f7280c4b26" alt="Icon" width="150" height="140" />
  <br>vue-fluid-dnd<br>
</h1>

A **fluid**, **smooth** and **versatil** drag and drop
library for lists on Vue3. It's a **lightweight** tool ~5 Kb (gzip) with no depenencies.

<img src="https://github.com/carlosjorger/vue-fluid-dnd/assets/50055316/4b25fd5e-4815-4a24-afe4-6f41d34be820" width="100%"/>

## ✨ Features

- ✅ **Fully customizable 🎨**.
- ✅ **Zero dependencies 🪶**.
- ✅ **Work with horizontal➡️and vertical list :arrow_down:**.
- ✅ **Mouse 🐭 and touch 👉📱 (mobile, tablet and so on) support**.
- ✅ **Nice documentation 📑 and examples**.
- ✅ **Fully tested 🧪, typed and reliable**.

## 🚀 Getting Started

1. **Install vue-fluid-dnd:**

   ```bash
   # with npm:
   npm i vue-fluid-dnd

   # with yarn:
   yarn add vue-fluid-dnd

   # with pnpm:
   pnpm i vue-fluid-dnd
   ```

2. **Import the vue composable**

   ```js
   import { useDragAndDrop } from "vue-fluid-dnd";
   ```

3. **Create a list that your want to sort an use useDragAndDrop**

   ```js
   // Each element have its own styles or classes and the draggable-id
   const listToSort = ref([
     {
       number: 1,
       style:
         "color: white; background-color: red; width: 50px; margin: 23px 0;",
     },
     //...
   ]);
   // create the parent element and set drag and drop configuration on the parent and children elements (creating events, statees, styles, etc) calling useDragAndDrop composable
   const { parent } = useDragAndDrop(listToSort);
   ```

4. **Create childrens**

   ```jsx
   <template>
      <div ref="parent" style="width: 40%; display: block">
         <div
            v-for="(element, index) in listToSort"
            :index="index"
            :style="element.style"
         >{{ element.number }}
         </div>
      </div>
   </template>
   ```

📚 [Check out all the docs here!](https://vue-fluid-dnd.netlify.app/)

## 🤝 Contributing

If you're interested in contributing to vue-fluid-dnd, please read our contributing docs before submitting a pull request [CONTRIBUTING](./CONTRIBUTING.md).
