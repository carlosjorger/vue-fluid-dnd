import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "VueJuiceDnD",
      social: {
        github: "https://github.com/carlosjorger/vue3-juice-dnd",
      },
      sidebar: [
        {
          label: "Introduction",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Getting Started",
              link: "/introduction/introduction/",
            },
          ],
        },
        {
          label: "Guide",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Single vertical list",
              link: "/guides/verticallist/",
            },
            {
              label: "Single vertical list with diferent styles",
              link: "/guides/verticalliststyles/",
            },
          ],
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference",
          },
        },
      ],
      customCss: [
        // Path to your Tailwind base styles:
        "./src/tailwind.css",
      ],
    }),
    vue(),
    tailwind({ applyBaseStyles: false }),
  ],
  adapter: netlify(),
});
