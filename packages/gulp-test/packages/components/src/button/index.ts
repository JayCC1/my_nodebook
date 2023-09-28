import { withInstall } from "@jaycce/gulp-utils";
import Button from "./src/button.vue";

const JButton = withInstall(Button);

export * from "./src/props";
export { JButton };
export default JButton;
