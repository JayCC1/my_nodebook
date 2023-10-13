import { createApp } from "vue";
import App from "./app.vue";
import * as comp from "@jaycce/gulp-components";
import "@jaycce/gulp-components/es/components/button/style/index";

const app = createApp(App);

app.use(comp);
app.mount("#app");
