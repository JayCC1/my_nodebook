import { createApp } from "vue";
import App from "./app.vue";
// 全局引入方式
// import * as comp from "@jaycce/gulp-components";
// import "@jaycce/gulp-components/es/components/button/style/index";
// const app = createApp(App);
// app.use(comp);

// 自动按需引入测试
const app = createApp(App);
app.mount("#app");
