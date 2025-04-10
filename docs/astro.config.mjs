import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

const site = "https://fluid-dnd.netlify.app/";
// TODO: add pr to starlight https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#showcase
export default defineConfig({
  site: "https://fluid-dnd.netlify.app/",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  integrations: [
    starlight({
      favicon: "/favicon.png",
      title: "Fluid DnD",
      description:
        "Official documentation for Fluid DnD, a fluid, agnostic and versatil drag and drop library for lists with Vue.",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        es: {
          label: "Español",
          lang: "es",
        },
      },
      logo: {
        light: "/src/assets/logo.svg",
        dark: "/src/assets/dark-logo.svg",
      },
      editLink: {
        baseUrl:
          "https://github.com/carlosjorger/fluid-dnd/tree/main/docs/",
      },
      customCss: process.env.NO_GRADIENTS ? [] : ["/src/assets/landing.css"],
      social: {
        github: "https://github.com/carlosjorger/fluid-dnd",
        linkedin: "https://github.com/carlosjorger",
        "x.com": "https://twitter.com/carlosjorgerc",
      },
      components: {
        SiteTitle: "./src/components/CustomTitle.astro",
      },
      sidebar: [
        {
          label: "Introduction",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Getting Started",
              link: "/introduction/introduction/",
              translations: {
                es: "Inicio rápido",
              },
            },
          ],
          translations: {
            es: "Introducción",
          },
        },
        {
          label: "Guide",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Single vertical list",
              link: "/guides/verticallist/",
              translations: {
                es: "Lista vertical simple",
              },
            },
            {
              label: "List with mixed styles",
              link: "/guides/verticalliststyles/",
              translations: {
                es: "Lista vertical con diferentes estilos",
              },
            },
            {
              label: "List on a scroll",
              link: "/guides/verticallistautoscroll/",
              translations: {
                es: "Lista en un contenedor con scroll",
              },
            },
            {
              label: "Single horizontal list",
              link: "/guides/horizontallist/",
              translations: {
                es: "Lista horizontal simple",
              },
            },
            {
              label: "List with handler",
              link: "/guides/listhandler/",
              translations: {
                es: "Lista con handler",
              },
            },
            {
              label: "isDraggable",
              link: "/guides/isdraggable/",
              translations: {
                es: "isDraggable",
              },
            },
            {
              label: "List group",
              link: "/guides/listgroup/",
              translations: {
                es: "Grupo de listas",
              },
            },
            {
              label: "List with inputs",
              link: "/guides/listinputs/",
              translations: {
                es: "Listas con inputs",
              },
            },
            {
              label: "Dragging styles",
              link: "/guides/draggingclass/",
              translations: {
                es: "Estilos al arrastrar",
              },
            },
             {
              label: "Dropping styles",
              link: "/guides/droppableclass/",
              translations: {
                es: "Estilos al soltar",
              },
            },
            {
              label: "Sorting tables",
              link: "/guides/sortingtable/",
              translations: {
                es: "Ordenar tablas",
              },
            },
            {
              label: "Remove on lists",
              link: "/guides/listremove/",
              translations: {
                es: "Remover en listas",
              },
            },
            {
              label: "Insert on list",
              link: "/guides/listinsert/",
              translations: {
                es: "Insertar en listas",
              },
            },
          ],
          translations: {
            es: "Guía",
          },
        },
      ],
      head: [
        {
          tag: "meta",
          attrs: { property: "og:image", content: site + "org.webp?v=1" },
        },
        {
          tag: "meta",
          attrs: { property: "twitter:image", content: site + "og.webp?v=1" },
        },
      ],
      customCss: [
        // Path to your Tailwind base styles:
        "./src/tailwind.css",
        "./src/assets/landing.css",
      ],
    }),
    vue(),
    tailwind({ applyBaseStyles: false }),
  ],
  adapter: netlify(),
});
