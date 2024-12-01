 <h1 align="center">
    <img src="https://github.com/carlosjorger/vue-fluid-dnd/assets/50055316/dab15832-5290-42ca-b425-db177a2e589e" alt="Icon" width="150" height="140" />
  <br>Vue Fluid DnD<br>
</h1>

<div align="center">

![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-fluid-dnd)
[![license](https://img.shields.io/github/license/carlosjorger/vue-fluid-dnd?label=license)](https://github.com/carlosjorger/vue-fluid-dnd/blob/main/LICENSE)
[![version](https://img.shields.io/npm/v/vue-fluid-dnd)](https://www.npmjs.com/package/vue-fluid-dnd)
![GitHub issues](https://img.shields.io/github/issues/carlosjorger/vue-fluid-dnd)
![GitHub stars](https://img.shields.io/github/stars/carlosjorger/vue-fluid-dnd)
[![twitter](https://img.shields.io/twitter/follow/carlosjorgerc)](https://twitter.com/carlosjorgerc)
[![test_coverage](https://api.codeclimate.com/v1/badges/6b27047dcf150ccddfac/test_coverage)](https://codeclimate.com/github/carlosjorger/vue-fluid-dnd/test_coverage)

</div>

Vue Fluid DnD is a [**fluid**, **smooth** and **versatil** drag and drop
library for lists on Vue3](https://vue-fluid-dnd.netlify.app/). It's a**lightweight** tool ~7 Kb (gzip) with no depenencies. This library is a **Vue Draggable** alternative if you looking for a better ui experience.

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

5. **Documentation**

- 📚 Check out all the [docs](https://vue-fluid-dnd.netlify.app/).
- 🛠️ Edit the previous [here](https://codesandbox.io/s/nifty-hooks-5plkpl).
- 📘 See others examples [here](https://vue-fluid-dnd.netlify.app/example/vertical-list/single-vertical-list/).

## 🤝 Contributing

If you're interested in contributing to vue-fluid-dnd, please read our contributing docs before submitting a pull request [CONTRIBUTING](./CONTRIBUTING.md).

## 🔑 License

- [MIT](https://github.com/carlosjorger/vue-fluid-dnd/blob/main/LICENSE).
