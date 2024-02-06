import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
// TODO: create guide sidar
// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "vue3JuiceDnD",
      social: {
        github: "https://github.com/carlosjorger/vue3-juice-dnd",
      },
      sidebar: [
        {
          label: "Introduction",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Getting Started", link: "/guides/introduction/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
