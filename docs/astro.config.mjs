import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";
import { FRAMEWORKS_TEMPLATE } from './src/types'
import svelte from "@astrojs/svelte";
const site = "https://fluid-dnd.netlify.app/";
// TODO: add pr to starlight https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#showcase
export default defineConfig({
  site: "https://fluid-dnd.netlify.app/",
  redirects: {
    '/': '/vue'
  },
  integrations: [starlight({
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
    social: [
      { icon: 'github', label: 'GitHub', href: "https://github.com/carlosjorger/fluid-dnd" },
      { icon: 'linkedin', label: 'Linkedin', href: "https://github.com/carlosjorger" },
      { icon: 'x.com', label: 'X', href: "https://x.com/carcu_ps" },
    ],
    components: {
      SiteTitle: "./src/components/CustomTitle.astro",
    },
    routeMiddleware: './src/middlewares/frameworkSidebaMiddleWare.ts',
    sidebar: [
      {
        label: "Introduction",
        items: [
          // Each item here is one entry in the navigation menu.
          {
            label: "Getting Started",
            link: "/framework/introduction/introduction/",
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
            link: `/${FRAMEWORKS_TEMPLATE}/guides/verticallist/`,
            translations: {
              es: "Lista vertical simple",
            },
          },
          {
            label: "List with mixed styles",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/verticalliststyles/`,
            translations: {
              es: "Lista vertical con diferentes estilos",
            },
          },
          {
            label: "List on a scroll",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/verticallistautoscroll/`,
            translations: {
              es: "Lista en un contenedor con scroll",
            },
          },
          {
            label: "Single horizontal list",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/horizontallist/`,
            translations: {
              es: "Lista horizontal simple",
            },
          },
          {
            label: "List with handler",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/listhandler/`,
            translations: {
              es: "Lista con handler",
            },
          },
          {
            label: "isDraggable",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/isdraggable/`,
            translations: {
              es: "isDraggable",
            },
          },
          {
            label: "List group",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/listgroup/`,
            translations: {
              es: "Grupo de listas",
            },
          },
          {
            label: "List with inputs",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/listinputs/`,
            translations: {
              es: "Listas con inputs",
            },
          },
          {
            label: "Dragging styles",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/draggingclass/`,
            translations: {
              es: "Estilos al arrastrar",
            },
          },
           {
            label: "Dropping styles",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/droppableclass/`,
            translations: {
              es: "Estilos al soltar",
            },
          },
          {
            label: "Sorting tables",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/sortingtable/`,
            translations: {
              es: "Ordenar tablas",
            },
          },
          {
            label: "Remove on lists",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/listremove/`, 
            translations: {
              es: "Remover en listas",
            },
          },
          {
            label: "Insert on list",
            link: `/${FRAMEWORKS_TEMPLATE}/guides/listinsert/`,
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
  }), vue(), tailwind({ applyBaseStyles: false }), svelte()],
  adapter: netlify(),
});