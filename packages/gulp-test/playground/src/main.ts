import { createApp } from "vue";
import App from "./app.vue";
import * as comp from "@jaycce/gulp-components";
import "element-plus/theme-chalk/index.css";

const app = createApp(App);

app.use(comp);
app.mount("#app");
