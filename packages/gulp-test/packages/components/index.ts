import type { App } from "vue";
import JButton from "./src/button";
import JIcon from "./src/icon";

export * from "./src/button";
export * from "./src/icon";

const components = [JButton, JIcon];

export function install(app: App) {
  components.forEach((item) => {
    if (item.install!) {
      app.use(item);
    }
  });
}

export default {
  install,
};
