/** @type {import('tailwindcss').Config} */
import starlightPlugin from "@astrojs/starlight-tailwind";
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [starlightPlugin()],
};
