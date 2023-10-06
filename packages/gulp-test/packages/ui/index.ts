import type { App } from "vue";
import JButton from "./components/button";
import JIcon from "./components/icon";

export * from "./components/button";
export * from "./components/icon";

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
