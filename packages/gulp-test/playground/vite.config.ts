import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { uiResolver } from "@jaycce/gulp-utils/lib/ui-resolvers";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [uiResolver()],
    }),
  ],
});
